"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Database, LucideLoader2, MoveUp, RefreshCcw } from "lucide-react";
import React, { useState } from "react";

const VectorDBPage = () => {
  const [isUploading, setisUploading] = useState(false);
  const [indexname, setIndexname] = useState("");
  const [namespace, setNamespace] = useState("");
  const [fileListAsText, setfileListAsText] = useState("");

  const [filename, setFilename] = useState("");
  const [progress, setProgress] = useState(0);

  const onFileListRefresh = async () => {
    setfileListAsText("");
    const response = await fetch("api/getfilelist", { method: "GET" });
    const filenames = await response.json();
    console.log(filenames);
    const resultString = (filenames as [])
      .map((filename) => `📄 ${filename}`)
      .join("\n");
    setfileListAsText(resultString);
  };

  const onStartUpload = async () => {
    setProgress(0);
    setFilename("");
    if (indexname && namespace) {
      setisUploading(true);
    }
    const response = await fetch("api/updatedatabase", {
      method: "POST",
      body: JSON.stringify({
        indexname,
        namespace,
      }),
    });
    console.log(response);
    await processStreamedProgress(response);
  };

  async function processStreamedProgress(response: Response) {
    const reader = response.body?.getReader();
    if (!reader) {
      console.error("Reader was not found");
      return;
    }

    const decoder = new TextDecoder();
    let buffer = ""; 

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          setisUploading(false);
          break;
        }

        buffer += decoder.decode(value, { stream: true });

        const jsonObjects = buffer.split("\n");
        buffer = jsonObjects.pop() || "";

        for (const json of jsonObjects) {
          try {
            if (!json.trim()) continue;
            const { filename, totalChunks, chunksUpserted } = JSON.parse(json);
            const currentProgress = (chunksUpserted / totalChunks) * 100;
            setProgress(currentProgress);
            setFilename(`${filename} [${chunksUpserted}/${totalChunks}]`);
          } catch (error) {
            console.error("Error parsing JSON chunk:", error, json);
          }
        }
      }
    } catch (error) {
      console.error("Error reading response:", error);
    } finally {
      reader.releaseLock();
    }
  }

  return (
    <main className=" p-24 min-w-[900px] max-w-[1100px]">
      <Card>
        <CardHeader>
          <CardTitle>Update Knowledge Base</CardTitle>
          <CardDescription>Add new docuemnts to your vector DB</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 grid gap-4 border rounded-lg p-6">
              <div className="gap-4 relative">
                <Button
                  onClick={onFileListRefresh}
                  className="absolute -right-4 -top-4"
                  variant={"ghost"}
                  size={"icon"}
                >
                  <RefreshCcw />
                </Button>
                <Label>Files List:</Label>
                <Textarea
                  readOnly
                  value={fileListAsText}
                  className="min-h-24 resize-none border p-3 shadow-none disabled:cursor-default focus-visible:ring-0 text-sm text-muted-foreground"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Index Name</Label>
                  <Input
                    value={indexname}
                    onChange={(e) => setIndexname(e.target.value)}
                    placeholder="index name"
                    disabled={isUploading}
                    className="disabled:cursor-default"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Namespace</Label>
                  <Input
                    value={namespace}
                    onChange={(e) => setNamespace(e.target.value)}
                    placeholder="namespace"
                    disabled={isUploading}
                    className="disabled:cursor-default"
                  />
                </div>
              </div>
            </div>
            <Button
              onClick={onStartUpload}
              variant={"outline"}
              className="w-full h-full"
              disabled={isUploading}
            >
              <span className="flex flex-row">
                <Database size={50} className="stroke-[#D90013]" />
                <MoveUp className="stroke-[#D90013]" />
              </span>
            </Button>
          </div>
          {isUploading && (
            <div className="mt-4">
              <Label>File Name: {filename}</Label>
              <div className="flex flex-row items-center gap-4">
                <Progress value={progress} />
                <LucideLoader2 className="stroke-[#D90013] animate-spin" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default VectorDBPage;
