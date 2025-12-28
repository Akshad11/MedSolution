"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import {
    Plus,
    Send,
    Trash2,
    Code2,
    History,
    Server,
} from "lucide-react";

type KV = { key: string; value: string };

type HistoryItem = {
    method: string;
    url: string;
    body: any;
    status?: number;
    response?: any;
    time: string;
};

const methodColors: Record<string, string> = {
    GET: "bg-green-100 text-green-700",
    POST: "bg-blue-100 text-blue-700",
    PUT: "bg-yellow-100 text-yellow-700",
    PATCH: "bg-purple-100 text-purple-700",
    DELETE: "bg-red-100 text-red-700",
};

export default function ApiTester() {
    const { user } = useAuth();

    const [method, setMethod] = useState("GET");
    const [url, setUrl] = useState("/api/");
    const [jsonBody, setJsonBody] = useState("{}");
    const [pairs, setPairs] = useState<KV[]>([]);
    const [usePairs, setUsePairs] = useState(false);

    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<any>(null);
    const [status, setStatus] = useState<number | null>(null);

    const [history, setHistory] = useState<HistoryItem[]>([]);

    const addPair = () =>
        setPairs((p) => [...p, { key: "", value: "" }]);

    const updatePair = (i: number, field: "key" | "value", val: string) => {
        const copy = [...pairs];
        copy[i][field] = val;
        setPairs(copy);
    };

    const removePair = (i: number) =>
        setPairs((p) => p.filter((_, idx) => idx !== i));

    const buildBody = () => {
        if (!usePairs) return jsonBody ? JSON.parse(jsonBody) : undefined;
        const obj: any = {};
        pairs.forEach((p) => {
            if (p.key) obj[p.key] = p.value;
        });
        return obj;
    };

    const send = async () => {
        setLoading(true);
        setResponse(null);
        setStatus(null);

        try {
            const body = buildBody();
            const res = await api.request({
                method: method as any,
                url,
                data: ["POST", "PUT", "PATCH"].includes(method) ? body : undefined,
            });

            setResponse(res.data);
            setStatus(res.status);

            setHistory((h) => [
                {
                    method,
                    url,
                    body,
                    status: res.status,
                    response: res.data,
                    time: new Date().toLocaleTimeString(),
                },
                ...h.slice(0, 9),
            ]);
        } catch (err: any) {
            setStatus(err?.response?.status || 500);
            setResponse(err?.response?.data || { error: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-10 space-y-6 bg-gradient-to-br from-slate-900 to-slate-800 text-gray-100">

            {/* Header */}
            <div className="flex items-center gap-3">
                <Server className="text-blue-400" />
                <div>
                    <h1 className="text-2xl font-semibold">API Tester</h1>
                    <p className="text-sm text-gray-400">
                        Logged in as <span className="font-medium text-white">{user?.name}</span>
                    </p>
                </div>
            </div>

            {/* Request Builder */}
            <div className="bg-white text-gray-800 rounded-xl shadow-lg p-6 space-y-5">
                <div className="flex items-center gap-2 font-semibold text-gray-900">
                    <Code2 size={18} /> Request Builder
                </div>

                {/* Method & URL */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <select
                        value={method}
                        onChange={(e) => setMethod(e.target.value)}
                        className="border rounded-lg px-3 py-2 text-sm sm:w-32"
                    >
                        {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
                            <option key={m}>{m}</option>
                        ))}
                    </select>

                    <input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="/api/doctor"
                        className="flex-1 border rounded-lg px-3 py-2 text-sm"
                    />

                    <button
                        onClick={send}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60"
                    >
                        <Send size={16} />
                        {loading ? "Sending..." : "Send"}
                    </button>
                </div>

                {/* Body Toggle */}
                <div className="flex gap-6 text-sm">
                    <label className="flex items-center gap-2">
                        <input type="radio" checked={!usePairs} onChange={() => setUsePairs(false)} />
                        Raw JSON
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="radio" checked={usePairs} onChange={() => setUsePairs(true)} />
                        Key / Value
                    </label>
                </div>

                {/* Body Input */}
                {!usePairs ? (
                    <textarea
                        rows={6}
                        value={jsonBody}
                        onChange={(e) => setJsonBody(e.target.value)}
                        className="w-full border rounded-lg p-3 text-sm font-mono bg-gray-50"
                        placeholder='{"name": "John"}'
                    />
                ) : (
                    <div className="space-y-3">
                        {pairs.map((p, i) => (
                            <div key={i} className="flex gap-2">
                                <input
                                    value={p.key}
                                    onChange={(e) => updatePair(i, "key", e.target.value)}
                                    placeholder="key"
                                    className="flex-1 border rounded-lg px-3 py-2 text-sm"
                                />
                                <input
                                    value={p.value}
                                    onChange={(e) => updatePair(i, "value", e.target.value)}
                                    placeholder="value"
                                    className="flex-1 border rounded-lg px-3 py-2 text-sm"
                                />
                                <button
                                    onClick={() => removePair(i)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}

                        <button
                            onClick={addPair}
                            className="inline-flex items-center gap-2 text-sm text-blue-600"
                        >
                            <Plus size={14} /> Add field
                        </button>
                    </div>
                )}
            </div>

            {/* Response */}
            <div className="bg-white text-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Server size={16} /> Response
                    {status && (
                        <span
                            className={`ml-2 text-xs px-2 py-1 rounded-full ${status < 300
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                                }`}
                        >
                            {status}
                        </span>
                    )}
                </h3>

                <pre className="text-sm bg-gray-50 p-4 rounded-lg overflow-auto max-h-80">
                    {response
                        ? JSON.stringify(response, null, 2)
                        : "No response yet"}
                </pre>
            </div>

            {/* History */}
            <div className="bg-white text-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <History size={16} /> Recent Calls
                </h3>

                {history.length === 0 && (
                    <p className="text-sm text-gray-500">No calls yet</p>
                )}

                <div className="space-y-2">
                    {history.map((h, i) => (
                        <div
                            key={i}
                            className="flex justify-between items-center border rounded-lg px-3 py-2 text-sm"
                        >
                            <div className="flex items-center gap-2">
                                <span
                                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${methodColors[h.method]
                                        }`}
                                >
                                    {h.method}
                                </span>
                                <span>{h.url}</span>
                                <span className="text-gray-400 text-xs">({h.time})</span>
                            </div>

                            <span
                                className={`text-xs font-medium ${h.status && h.status < 300
                                    ? "text-green-600"
                                    : "text-red-600"
                                    }`}
                            >
                                {h.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
