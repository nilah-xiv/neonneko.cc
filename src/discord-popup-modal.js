document.addEventListener("DOMContentLoaded", () => {
  console.log("[Modal] DOM fully loaded");

  const form = document.getElementById("staffAppForm");

  if (!form) {
    console.warn("[Modal] staffAppForm not found.");
    return;
  }

  console.log("[Modal] staffAppForm found, setting up submit handler");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    console.log("[Modal] Form submitted — starting modal logic");

    try {
      const configRes = await fetch("config.json");
      console.log("[Modal] Fetching config.json...");

      if (!configRes.ok) {
        throw new Error("Failed to load config.json");
      }

      const config = await configRes.json();
      console.log("[Modal] Config loaded:", config);

      const modalRes = await fetch("src/discord-popup-modal.html");
      console.log("[Modal] Fetching discord-popup-modal.html...");

      if (!modalRes.ok) {
        throw new Error("Failed to load modal HTML");
      }

      const modalHtml = await modalRes.text();
      console.log("[Modal] Modal HTML loaded");

      const modalWrapper = document.createElement("div");
      modalWrapper.innerHTML = modalHtml;
      document.body.appendChild(modalWrapper);
      console.log("[Modal] Modal injected into DOM");

      const discordLink = document.getElementById("discordLink");
      if (discordLink) {
        discordLink.href = config.discordInvite;
        console.log("[Modal] Discord link set to:", discordLink.href);
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
        console.log("[Modal] Modal displayed with animation");
      });

      closeBtn.onclick = () => {
        console.log("[Modal] Close button clicked");
        modal.classList.remove("show");
        modal.style.display = "none";
        modalWrapper.remove();
      };

      window.onclick = (e) => {
        if (e.target === modal) {
          console.log("[Modal] Clicked outside modal — closing");
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

