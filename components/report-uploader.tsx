"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import {
  Camera,
  CameraIcon,
  CameraOff,
  Loader,
  LoaderCircleIcon,
} from "lucide-react";

function ReportUploader() {
  const [base64String, setBase64String] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reportText, setReportText] = useState("");

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
          reader.onloadend = () => {
            const base64string = reader.result as string;
            setBase64String(base64string);
            console.log(base64string);
          };
          reader.readAsDataURL(compressedFile);
        });
      }
    }
  }

  useEffect(() => {
    const testImg = document.getElementById("test") as HTMLImageElement | null;
    if (testImg) testImg.src = base64String;
  }, [base64String]);

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

        const quality = 0.2;

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
              });
              callback(compressedFile);
            }
          },
          "image/jpeg",
          quality
        );
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  }

  async function extractDetails(): Promise<void> {
    if (base64String === "") return;
    setIsLoading(true);

    const response = await fetch("api/extractreportgemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        base64: base64String,
      }),
    });

    if (response.ok) {
      const resText = await response.text();
      setReportText(resText);
    }

    setIsLoading(false);
  }

  function handleReportUpload(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="relative flex flex-col items-center w-full justify-center gap-6 overflow-auto p-4 pt-8">
      <fieldset className="relative flex flex-col w-full gap-6 rounded-lg border p-4  max-w-[800px] ">
        <legend className="text-sm font-medium">Report Uploader</legend>
        <input
          id="file-upload"
          type="file"
          accept=".jpeg, .jpg, .png, .webp, .pdf"
          onChange={handleReportSelection}
          className="file:bg-[rgb(158,64,66)] file:px-4 file:py-2 file:rounded-lg file:font-semibold file:cursor-pointer file:hover:bg-amber-900"
        />
        <Button
          onClick={() => {
            extractDetails();
          }}
        >
          Extract Details
        </Button>
        {isLoading && <LoaderCircleIcon className="animate-spin" />}

        <label htmlFor="">Report Summary</label>
        <Textarea
          value={reportText}
          onChange={() => {}}
          placeholder="Extracted data will appear here..."
          className="min-h-60 resize-none border-1 p-3 shadow-none focus-visible:ring-2"
        ></Textarea>
        <Button variant={"destructive"} className=" text-white">
          Upload Report
        </Button>
      </fieldset>
      <img src={undefined} id="test" />
    </div>
  );
}

export default ReportUploader;
