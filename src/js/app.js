import { useState } from 'react';

export function App() {

    const [img, setImg] = useState(null);

    function onInputChange(e) { // https://web.dev/articles/read-files?hl=fr
        const reader = new FileReader();
        reader.addEventListener('load', event => {
            setImg(event.target.result);
        });
        reader.readAsDataURL(e.target.files[0]);
    }

    return (
        <>
            <h3>framimg</h3>
            <ImageInput onChange={onInputChange} />
            <FImage img={img} />
        </>
    );
}

function FImage({ img }) {
    if (img != null) {
        console.log("Setting image");
        return (<img id="output" className="responsive-img" src={img} />);
    }
    else { return <></> }
}

function ImageInput({ onChange }) {
    return (<input type="file" id="file-selector" accept=".jpg, .jpeg, .png" onChange={onChange} />);
}