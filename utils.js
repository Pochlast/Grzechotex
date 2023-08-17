document.querySelector(".play-btn").addEventListener('click', startRattle)

function startRattle() {
    let quantity = document.querySelector("#quantity").value;

    let size = document.querySelector("#one").checked;

    console.log(quantity);
    console.log(size);

    document.querySelector(".home-view").style["display"] = "none";
    document.querySelector(".rattle-view").style["display"] = "contents";
}
