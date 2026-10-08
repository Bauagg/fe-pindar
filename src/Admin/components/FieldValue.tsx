import React from "react";
import { ExternalLink } from "lucide-react";
import type { FieldType } from "../types";

interface Props {
  type: FieldType;
  value: string | null;
  fileUrl: string | null;
  label: string;
}

const isImage = (url: string) => /\.(jpe?g|png|webp|gif)$/i.test(url);

/** Tampilan nilai: teks (termasuk teks panjang), atau file/foto. */
export default function FieldValue({ type, value, fileUrl, label }: Props) {
  if (type === "file") {
    if (!fileUrl) return <span className="text-sm text-gray-400">Belum ada file</span>;
    return (
      <a href={fileUrl} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-3">
        {isImage(fileUrl) && <img src={fileUrl} alt={label} className="h-16 w-16 rounded-lg object-cover ring-1 ring-gray-200" />}
        <span className="inline-flex items-center gap-1 text-sm font-bold text-red-600 group-hover:text-red-700">
          Buka file <ExternalLink className="h-3.5 w-3.5" />
        </span>
      </a>
    );
  }
  return value ? <p className="whitespace-pre-wrap text-sm font-semibold text-gray-800">{value}</p> : <span className="text-sm text-gray-400">Kosong</span>;
}
