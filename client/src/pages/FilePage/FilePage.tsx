import { useState } from "react";
import "./file-page.scss";
import { useApp } from "../../context/AppSetupContext";
export default function FilePage() {
  const {appName} = useApp()!;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files) {
      const file = event?.target?.files[0];
      setSelectedFile(file);
      console.info("Selected file => ", file);
      console.info("File name => ", file?.name);
      console.info("File type => ", file?.type);
      console.info("File size => ", file?.size, "bytes");
    }
  };
  return (
    <div className="file-upload-page">
      <input
        className="file-upload-button"
        onChange={(e) => handleFileUpload(e)}
        type="file"
        accept=".mp4,.mov,.webm,.png,.jpeg,.svg,.jpg"
      />
      <h1 className="logo">
        {appName?.split("")?.map((n: string, i: number) => (
          <p key={i}> {n}</p>
        ))}
      </h1>
    </div>
  );
}
