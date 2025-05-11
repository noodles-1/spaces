import { useDropzone } from "react-dropzone";

export function Dropzone() {
    const { acceptedFiles, isDragActive, getRootProps, getInputProps } = useDropzone({
        noClick: true,
        noKeyboard: true,
        noDragEventsBubbling: true,
        onDrop: () => console.log("dropped")
    });

    return (
        <main className={`absolute ${isDragActive && "z-50"}`}>
            <div {...getRootProps()} className="h-screen w-screen">
                <input {...getInputProps()} />
            </div>
        </main>
    );
}