"use client";

import React, { ChangeEvent, useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";

function ReportUploader() {
  const [base64String, setBase64String] = useState("");

  function handleReportSelection(event: ChangeEvent<HTMLInputElement>): void {
    if (!event.target.files) return;

    const file = event.target.files[0];
    if (file) {
      let isValidImg = false;
      let isValidDoc = false;

      const validImages = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      const validDocs = ["application/pdf"];

      if (validImages.includes(file.type)) {
        isValidImg = true;
      } else if (validDocs.includes(file.type)) {
        isValidDoc = true;
      } else {
        toast.error("File is unsupportive!", {
          cancel: { label: "Close", onClick: () => {} },
        });
        return;
      }

      if (isValidDoc) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          const fileContent = reader.result as string;
          console.log(fileContent);
        };
      }

      if (isValidImg) {
        compressImage(file, (compressedFile: File) => {
          const reader = new FileReader();
          reader.readAsDataURL(compressedFile);
          reader.onloadend = () => {
            const base64string = reader.result as string;
            setBase64String(base64string);
            console.log(base64string);
          };
        });
      }
    }
  }
  function compressImage(file: File, callback: (compressedFile: File) => void) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;
        
        ctx?.drawImage(img, 0, 0);

        const quality = 0.1;

        const dataURL = canvas.toDataURL("image/jpeg", quality);

        const byteString = atob(dataURL.split(",")[1]);

        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const compressedFile = new File([ab], file.name, {
          type: "image/jpeg",
        });

        callback(compressedFile);
      };
    };

    reader.readAsDataURL(file);
  }

  function extractDetails(): void {
    // throw new Error("Function not implemented.");
  }

  function handleReportUpload(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="grid w-full items-start gap-6 overflow-auto p-4 pt-8">
      <fieldset className="relative grid gap-6 rounded-lg border p-4">
        <legend className="text-sm font-medium">Report Uploader</legend>
        <input
          type="file"
          accept=".jpeg, .jpg, .png, .webp, .pdf"
          onChange={handleReportSelection}
        />
        <Button onClick={extractDetails}>Extract Details</Button>

        <label htmlFor="">Report Summary</label>
        <Textarea
          placeholder="Extracted data will appear here..."
          className="min-h-72 resize-none border-1 p-3 shadow-none focus-visible:ring-2"
        ></Textarea>
        <Button variant={"destructive"} className="bg-red-500 text-white">
          Upload Report
        </Button>
      </fieldset>
    </div>
  );
}

export default ReportUploader;
