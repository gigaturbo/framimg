import { Uppload, Local, xhrUploader, en } from "uppload";

const uploader = new Uppload({
    lang: en,
    uploader: xhrUploader({
        endpoint: "https://gigaturbo.fr/upload"
    }),
    bind: document.querySelector("img.profile-pic"),
    call: document.querySelector("button.pic-btn")
});
uploader.use([new Local()]);