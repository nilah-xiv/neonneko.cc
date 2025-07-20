document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("staffAppForm");

  if (!form) {
    console.warn("[Modal] staffAppForm not found.");
    return;
  }


  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    try {
      const configRes = await fetch("config.json");

      if (!configRes.ok) {
        throw new Error("Failed to load config.json");
      }

      const config = await configRes.json();

      const modalRes = await fetch("src/discord-popup-modal.html");

      if (!modalRes.ok) {
        throw new Error("Failed to load modal HTML");
      }

      const modalHtml = await modalRes.text();

      const modalWrapper = document.createElement("div");
      modalWrapper.innerHTML = modalHtml;
      document.body.appendChild(modalWrapper);

      const discordLink = document.getElementById("discordLink");
      if (discordLink) {
        discordLink.href = config.discordInvite;
      } else {
        console.warn("[Modal] discordLink element not found");
      }

      const modal = document.getElementById("joinDiscordModal");
      const closeBtn = document.getElementById("closeModalBtn");

      if (!modal) {
        console.error("[Modal] joinDiscordModal not found in DOM");
        return;
      }

      modal.style.display = "block";
      requestAnimationFrame(() => {
        modal.classList.add("show");
      });

      closeBtn.onclick = () => {
        modal.classList.remove("show");
        modal.style.display = "none";
        modalWrapper.remove();
      };

      window.onclick = (e) => {
        if (e.target === modal) {
          modal.classList.remove("show");
          modal.style.display = "none";
          modalWrapper.remove();
        }
      };
    } catch (err) {
      console.error("[Modal] Error during modal load:", err);
    }
  });
});

