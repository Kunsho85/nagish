//on form load animation
document.addEventListener("DOMContentLoaded", () => {
  const loadElement = document.querySelector("[load]"); // Targetuje element sa atributom [load]
  const loaderElement = document.querySelector(".loader-small"); // Targetuje element sa klasom .loader-small

  if (loadElement && loaderElement) {
    loadElement.addEventListener("click", () => {
      loaderElement.classList.add("is-active"); // Dodaje klasu .is-active na element sa klasom .loader-small
    });
  }
});