import { Uppload, Local, Instagram, xhrUploader, en } from "uppload";

const uploader = new Uppload({
    lang: en,
    uploader: xhrUploader({
        endpoint: "https://example.com/upload"
    })
});
uploader.use([new Local()]);