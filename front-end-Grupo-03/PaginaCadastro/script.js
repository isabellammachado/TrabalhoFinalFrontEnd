document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formCadastro");
    const telefoneInput = document.getElementById("telefone");
    const cpfInput = document.getElementById("cpf");
    const senhaInput = document.getElementById("senha");
    const confirmaSenhaInput = document.getElementById("confirmaSenha");
    const nomeInput = document.getElementById("nome");
    const sobrenomeInput = document.getElementById("sobrenome");
    const emailInput = document.getElementById("email");

    function getErrorElement(input) {
        const next = input.nextElementSibling;
        if (next && next.classList && next.classList.contains("erro-campo")) return next;
        const span = document.createElement("div");
        span.className = "erro-campo";
        span.style.minHeight = "18px";
        span.style.marginTop = "6px";
        span.style.color = "red";
        span.style.fontSize = "13px";
        input.parentNode.insertBefore(span, input.nextSibling);
        return span;
    }

    function showError(input, message) {
        const el = getErrorElement(input);
        el.textContent = message;
        input.classList.add("input-erro");
    }

    function clearError(input) {
        const next = input.nextElementSibling;
        if (next && next.classList && next.classList.contains("erro-campo")) next.textContent = "";
        input.classList.remove("input-erro");
    }

    function clearAllErrors() {
        [nomeInput, sobrenomeInput, telefoneInput, cpfInput, emailInput, senhaInput, confirmaSenhaInput].forEach(clearError);
    }

    telefoneInput.addEventListener("input", () => {
        const digits = telefoneInput.value.replace(/\D/g, "").slice(0, 11);
        let formatted = digits;
        if (digits.length > 2 && digits.length <= 6) {
            formatted = `(${digits.slice(0, 2)})${digits.slice(2)}`;
        } else if (digits.length > 6 && digits.length <= 10) {
            formatted = `(${digits.slice(0, 2)})${digits.slice(2, 7)}-${digits.slice(7)}`;
        } else if (digits.length === 11) {
            formatted = `(${digits.slice(0, 2)})${digits.slice(2, 7)}-${digits.slice(7)}`;
        }
        telefoneInput.value = formatted;
        clearError(telefoneInput);
    });

    function formatCpfFromDigits(digits) {
        const d = (digits || "").slice(0, 11);
        if (d.length > 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
        if (d.length > 6) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
        if (d.length > 3) return `${d.slice(0, 3)}.${d.slice(3)}`;
        return d;
    }

    cpfInput.addEventListener("input", () => {
        const digits = cpfInput.value.replace(/\D/g, "").slice(0, 11);
        cpfInput.value = formatCpfFromDigits(digits);
        clearError(cpfInput);
    });

    cpfInput.addEventListener("paste", (e) => {
        e.preventDefault();
        const pasted = (e.clipboardData || window.clipboardData).getData("text");
        const digits = (pasted.match(/\d/g) || []).join("").slice(0, 11);
        cpfInput.value = formatCpfFromDigits(digits);
        clearError(cpfInput);
    });

    function validarCpf(digits) {
        if (!/^\d{11}$/.test(digits)) return false;
        if (/^(\d)\1{10}$/.test(digits)) return false;
        const nums = digits.split("").map(d => parseInt(d, 10));
        let sum = 0;
        for (let i = 0; i < 9; i++) sum += nums[i] * (10 - i);
        let rev = 11 - (sum % 11);
        if (rev === 10 || rev === 11) rev = 0;
        if (rev !== nums[9]) return false;
        sum = 0;
        for (let i = 0; i < 10; i++) sum += nums[i] * (11 - i);
        rev = 11 - (sum % 11);
        if (rev === 10 || rev === 11) rev = 0;
        if (rev !== nums[10]) return false;
        return true;
    }

    [nomeInput, sobrenomeInput, telefoneInput, cpfInput, emailInput, senhaInput, confirmaSenhaInput].forEach(input => input.addEventListener("input", () => clearError(input)));

    let successBanner = null;
    let serverErrorBanner = null;

    function createBanner({ type = "success", text = "", primaryLabel = "OK", onPrimary = null }) {
        if (type === "success" && successBanner) successBanner.remove();
        if (type === "error" && serverErrorBanner) serverErrorBanner.remove();

        const banner = document.createElement("div");
        banner.style.boxSizing = "border-box";
        banner.style.width = "100%";
        banner.style.margin = "0 0 12px 0";
        banner.style.padding = "12px 14px";
        banner.style.borderRadius = "8px";
        banner.style.display = "flex";
        banner.style.alignItems = "center";
        banner.style.justifyContent = "space-between";
        banner.style.gap = "12px";
        banner.style.fontSize = "14px";
        banner.style.boxShadow = "0 3px 8px rgba(0,0,0,0.06)";

        if (type === "success") {
            banner.style.backgroundColor = "#E6F6EA";
            banner.style.color = "#164E2C";
        } else {
            banner.style.backgroundColor = "#FDECEA";
            banner.style.color = "#6B0F0F";
        }

        const msg = document.createElement("div");
        msg.textContent = text;

        const actions = document.createElement("div");
        actions.style.display = "flex";
        actions.style.gap = "8px";
        actions.style.alignItems = "center";

        const primaryBtn = document.createElement("button");
        primaryBtn.type = "button";
        primaryBtn.textContent = primaryLabel;
        primaryBtn.style.padding = "8px 12px";
        primaryBtn.style.border = "none";
        primaryBtn.style.borderRadius = "6px";
        primaryBtn.style.cursor = "pointer";
        primaryBtn.style.background = "#6f0f59";
        primaryBtn.style.color = "#fff";
        primaryBtn.style.fontSize = "14px";
        primaryBtn.style.fontWeight = "600";

        const closeBtn = document.createElement("button");
        closeBtn.type = "button";
        closeBtn.textContent = "Fechar";
        closeBtn.style.padding = "8px 12px";
        closeBtn.style.border = "none";
        closeBtn.style.borderRadius = "6px";
        closeBtn.style.cursor = "pointer";
        closeBtn.style.background = "#F3F5F7";
        closeBtn.style.fontSize = "13px";
        closeBtn.style.color = "#333";
        closeBtn.style.padding = "6px 10px";

        actions.appendChild(primaryBtn);
        actions.appendChild(closeBtn);
        banner.appendChild(msg);
        banner.appendChild(actions);

        primaryBtn.addEventListener("click", () => {
            if (typeof onPrimary === "function") onPrimary();
        });
        closeBtn.addEventListener("click", () => {
            banner.remove();
            if (type === "success") successBanner = null;
            else serverErrorBanner = null;
        });

        return banner;
    }

    function showSuccess(text = "Cadastro realizado com sucesso!") {
        const banner = createBanner({
            type: "success",
            text,
            primaryLabel: "Ir para login",
            onPrimary: () => (window.location.href = "../PaginaLogin/index.html"),
        });
        successBanner = banner;
        const container = form.parentElement;
        if (container) container.insertBefore(banner, form);
        const btn = banner.querySelector("button");
        if (btn) btn.focus();
    }

    function showServerError(text = "Erro ao cadastrar usuário. Tente novamente.") {
        const banner = createBanner({
            type: "error",
            text,
            primaryLabel: "OK",
            onPrimary: () => banner.remove(),
        });
        serverErrorBanner = banner;
        const container = form.parentElement;
        if (container) container.insertBefore(banner, form);
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearAllErrors();

        const nome = nomeInput.value.trim();
        const sobrenome = sobrenomeInput.value.trim();
        const telefoneDigits = telefoneInput.value.replace(/\D/g, "");
        const cpfDigits = cpfInput.value.replace(/\D/g, "");
        const email = emailInput.value.trim();
        const senha = senhaInput.value;
        const confirmaSenha = confirmaSenhaInput.value;

        let hasError = false;

        if (!nome) { showError(nomeInput, "Nome é obrigatório."); hasError = true; }
        if (!sobrenome) { showError(sobrenomeInput, "Sobrenome é obrigatório."); hasError = true; }

        if (!telefoneDigits) {
            showError(telefoneInput, "Telefone é obrigatório."); hasError = true;
        } else if (telefoneDigits.length !== 11) {
            showError(telefoneInput, "Telefone deve ter 11 dígitos (DDD + número)."); hasError = true;
        }

        if (!cpfDigits) {
            showError(cpfInput, "CPF é obrigatório."); hasError = true;
        } else if (cpfDigits.length !== 11) {
            showError(cpfInput, "CPF deve ter 11 dígitos."); hasError = true;
        } else {
            console.log("Validação de CPF pulada para projeto (aceito qualquer 11 dígitos):", cpfDigits);
        }

        if (!email) { showError(emailInput, "Email é obrigatório."); hasError = true; }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError(emailInput, "Email inválido."); hasError = true; }

        if (!senha) { showError(senhaInput, "Senha é obrigatória."); hasError = true; }
        if (!confirmaSenha) { showError(confirmaSenhaInput, "Confirme a senha."); hasError = true; }
        if (senha && confirmaSenha && senha !== confirmaSenha) { showError(confirmaSenhaInput, "As senhas não coincidem."); hasError = true; }

        if (hasError) return;

        const novoUsuario = {
            Nome: nome,
            Sobrenome: sobrenome,
            Telefone: telefoneDigits,
            Cpf: cpfDigits,
            Email: email,
            Senha: senha
        };

        try {
            if (window && window.API && typeof window.API.postUser === "function") {
                await window.API.postUser(novoUsuario);
            } else if (typeof window.postUser === "function") {
                await window.postUser(novoUsuario);
            } else {
                console.log("postUser não encontrada — simulando envio:", novoUsuario);
            }

            showSuccess("Cadastro realizado com sucesso!");
            form.reset();
            clearAllErrors();
        } catch (error) {
            console.error("Erro ao cadastrar usuário:", error);
            showServerError(error && error.message ? `Erro: ${error.message}` : "Erro ao cadastrar usuário. Tente novamente.");
        }
    });
});
