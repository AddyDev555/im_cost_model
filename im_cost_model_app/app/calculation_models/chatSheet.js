"use client";
import { useState } from "react";
import ReactMarkdown from 'react-markdown';
import {Bot} from "lucide-react";

export default function ChatWithSheet() {
    const [messages, setMessages] = useState([
        { role: "bot", text: "Hi! Ask me anything about your Cost Model." }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const material_cost_details = [
        'shot1',
        'shot 1',
        'shot2',
        'shot 2',
        'Weight',
        'Shot 1 Ratio',
        'Shot 1 Polymer Rate',
        'Shot 1 Resin Cost',
        'Shot 1 Masterbatch Dosage',
        'Shot 1 Masterbatch Rate',
        'Shot 1 Masterbatch Cost',
        'Shot 1 Additive Dosage',
        'Shot 1 Additive Rate',
        'Shot 1 Additive Cost',
        'Shot 2 Ratio',
        'Shot 2 Polymer Rate',
        'Shot 2 Resin Cost',
        'Regrind Ratio',
        'Regrind Polymer Rate',
        'Regrind Resin Cost',
        'Shot 2 Masterbatch Dosage',
        'Shot 2 Masterbatch Rate',
        'Shot 2 Masterbatch Cost',
        'Shot 2 Additive Dosage',
        'Shot 2 Additive Rate',
        'Shot 2 Additive Cost',
        'Wastage',
        'Other Costs',
        'Label Cost',
        'Material',
        "Material Cost",
        'material_cost'
    ];

    const conversion_cost_details = [
        'Conversion Cost',
        'Conversion',
        'Electricity',
        'Labour',
        'Manpower',
        'Repair',
        'Maintenance',
        'Overheads',
        'Lease',
        'Depreciation',
        'Interest',
        'Distribution',
        'Skilled Labour',
        'Engineer',
        'Production Manager',
        'Depreciation on Plant & Machinery',
        'Depreciation on Building',
        'Completed life of asset',
        'Land Cost',
        'Building Investment',
        'Lease Cost',
        'Type of Premises',
        'Interest on Long Term Loan',
        'Interest on Working Capital',
        'Margin Calculation',
        'No of Orders per Year',
        'Caps per Box',
        'Boxes per Pallet',
        'Pallet Type',
        'Type of Container',
        'Boxes per Container',
        'Shipper Cost',
        'Polybag Cost',
        'Packing Cost',
        'Freight cost per container',
        'Days per Year',
        'Shifts per Day',
        'Hours per Day',
        'Efficiency',
        'Available hours per year',
        'Working Capital',
        'Inventory Holding',
        'Warehousing Cost',
        'RM Inventory',
        'Silo Size',
        'FG Inventory',
        'Rack Size',
        'Tool Room',
        'Procurement',
        'Logistics',
        'Safety',
        'Quality',
        'Security',
        'Housekeeping',
        'General Manager',
        'Common Investment',
        'Delivery Cost',
        'Payment term',
        'cash gap',
        'Depreciation Schedule',
        'Interest Schedule',
        'EMI',
        'Beginning Balance',
        'Ending Balance',
        'conversion_cost'
    ];

    const machine_cost_details = [
        'Machine Cost',
        'Mould Cavitation',
        'Mould Cycle Time',
        'Machine Model',
        'Tonnage',
        'Annual Volume',
        'Capacity Required',
        'Output / Hour',
        'Output / Annum',
        'Hours Required for Set up',
        'Hours Required for Ramp Up',
        'Hours Required for Production',
        'No of Machines Required',
        'Capacity Utilized',
        'Actual Production Hours / Annum',
        'Production Hours / Annum Allocated',
        'Set Up & Ramp Up',
        'Average Order Size',
        'No of Set Up / Year',
        'Time Required for Set Up',
        'No of Ramp Ups/Year',
        'Time Required for Ramp Up',
        'Machine Speed at Ramp Up',
        'No of Component Wasted',
        'Process Wastage',
        'Burning Wastage',
        'Robotic Arm',
        'Ancilliary Equipments',
        'Total Investment',
        'machine_cost'
    ];

    const summary_details = [
        'Feedstock',
        'Injection',
        'Assembly',
        'Dispatch',
        'Summary',
        'Margin',
        'Packaging',
        'Freight'
    ];

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user", text: input };

        // Append user message
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        let sheetName = 'summary';
        const lowerCaseInput = userMessage.text.toLowerCase();

        // Check for keywords in a specific order of priority
        if (summary_details.some(keyword => lowerCaseInput.includes(keyword.toLowerCase()))) {
            sheetName = 'summary';
        } else if (material_cost_details.some(keyword => lowerCaseInput.includes(keyword.toLowerCase()))) {
            sheetName = 'material_cost';
        } else if (conversion_cost_details.some(keyword => lowerCaseInput.includes(keyword.toLowerCase()))) {
            sheetName = 'conversion cost';
        } else if (machine_cost_details.some(keyword => lowerCaseInput.includes(keyword.toLowerCase()))) {
            sheetName = 'conversion cost';
        }

        try {
            const res = await fetch("http://127.0.0.1:8000/api/qna/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mode: "ask",
                    sheetName: sheetName,
                    question: userMessage.text,
                })
            });

            const data = await res.json();

            let botText = "Sorry, I couldn't get a response.";

            if (data?.answer) botText = data.answer;
            if (data?.error) botText = "❌ Error: " + data.error;

            const botMessage = { role: "bot", text: botText };

            // Add bot response
            setMessages(prev => [...prev, botMessage]);
        } catch (err) {
            setMessages(prev => [
                ...prev,
                { role: "bot", text: "Server error: " + err.message }
            ]);
        }

        setLoading(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") sendMessage();
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-2 bg-gray-50 rounded shadow">
            {/* Chat Box */}
            <div className="h-[200px] overflow-y-auto bg-white border p-2 rounded">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`mb-3 p-2 rounded flex gap-x-2 ${msg.role === "user"
                                ? "items-center mr-auto bg-blue-100 w-fit max-w-[100%] text-blue-900"
                                : "items-start ml-auto bg-transparent text-justify border-b border-t w-[100%] text-black"
                            }`}
                    >
                        {msg.role === 'user' ? (
                            <span className="font-bold">User: </span>
                        ) : (
                            <span className="font-bold flex items-center gap-x-1 pt-1">
                                <Bot width={20} />
                            </span>
                        )}
                        {msg.role === 'user' ? (
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                        ) : (
                            <div className="prose prose-sm max-w-none"><ReactMarkdown>{msg.text}</ReactMarkdown></div>
                        )}
                    </div>
                ))}

                {loading && (
                    <div className="mr-auto bg-transparent p-2 rounded-lg w-fit">
                        Thinking...
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="flex gap-2 mt-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask anything about cost model..."
                    className="flex-1 border rounded px-3 py-1 bg-white"
                />
                <button
                    onClick={sendMessage}
                    disabled={loading}
                    className="bg-violet-500 cursor-pointer text-white px-4 rounded hover:bg-violet-600 disabled:bg-violet-300"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
