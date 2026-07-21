"use client";

import { useRef, useState } from "react";

// Buttons/slider use the standard blue-600; numeric text uses a lighter blue-300
// for sufficient contrast against the dark background (WCAG AA).
const ACCENT = "#2563eb";
const ACCENT_TEXT = "#93c5fd";
const ACCENT_TINT_BG = "#1f2937";

const isWhole = (n) => Math.abs(n - Math.round(n)) < 0.005;

export default function TipCalculator() {
  const [bill, setBill] = useState("0.00");
  const [tipPercentage, setTipPercentage] = useState(15);
  const [split, setSplit] = useState(1);
  const inputRef = useRef(null);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

  const moveCursorToEnd = () => {
    if (inputRef.current) {
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  };

  const handleBillChange = (e) => {
    const cleanValue = e.target.value.replace(/\D/g, "");
    const centsValue = parseInt(cleanValue, 10) || 0;
    const dollarsValue = centsValue / 100;

    setBill(formatCurrency(dollarsValue));
  };

  // Derived calculations
  const parsedBill = parseFloat(bill) || 0;
  const tipAmount = parsedBill * (tipPercentage / 100);
  const totalAmount = parsedBill + tipAmount;
  const perPersonAmount = split > 0 ? totalAmount / split : totalAmount;

  // Rounding handlers step the total to the next/previous whole dollar on every click
  const handleRoundUp = () => {
    if (parsedBill === 0) return;
    const target = isWhole(totalAmount) ? Math.round(totalAmount) + 1 : Math.ceil(totalAmount);
    const newTipAmount = target - parsedBill;
    setTipPercentage(Number(Math.max(0, (newTipAmount / parsedBill) * 100).toFixed(2)));
  };

  const handleRoundDown = () => {
    if (parsedBill === 0) return;
    let target = isWhole(totalAmount) ? Math.round(totalAmount) - 1 : Math.floor(totalAmount);
    if (target < parsedBill) target = parsedBill; // never dip below a 0% tip
    const newTipAmount = target - parsedBill;
    setTipPercentage(Number(Math.max(0, (newTipAmount / parsedBill) * 100).toFixed(2)));
  };

  const presetTips = [15, 18, 20, 25];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#1f2937,_#020617)] flex items-center justify-center p-3 sm:p-4">
      <div className="bg-gray-900/90 border border-gray-800 rounded-3xl shadow-2xl shadow-blue-950/30 p-4 sm:p-6 w-full max-w-md backdrop-blur-sm">
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-5 sm:mb-6 text-center tracking-tight">Smart Tip Calculator</h1>

        {/* Results Block */}
        <div className="sticky top-0 z-10 bg-gray-800/90 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-gray-700 shadow-lg shadow-gray-950/30 mb-4 sm:static">
          <div className="flex justify-between items-center mb-2 sm:mb-3">
            <span className="text-sm sm:text-base text-gray-400">Tip Amount</span>
            <span className="text-base sm:text-lg font-semibold text-white">${tipAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-2 sm:mb-3">
            <span className="text-sm sm:text-base text-gray-400 font-medium">Total Bill</span>
            <span className="text-xl sm:text-2xl font-bold text-white">${totalAmount.toFixed(2)}</span>
          </div>
          {split > 1 && (
            <div className="flex justify-between items-center pt-3 border-t border-gray-700">
              <span className="font-medium" style={{ color: ACCENT_TEXT }}>Per Person</span>
              <span className="text-xl font-bold" style={{ color: ACCENT_TEXT }}>${perPersonAmount.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Bill Amount Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">Bill Amount</label>
          <div className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-slate-950/95 shadow-[inset_0_3px_10px_rgba(0,0,0,0.65),0_8px_18px_rgba(37,99,235,0.12)]">
            <div className="absolute inset-y-0 left-0 flex items-center px-4 border-r border-blue-500/20 bg-slate-900/85">
              <span className="text-lg font-bold text-blue-300">$</span>
            </div>
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              className="w-full bg-transparent text-white placeholder:text-slate-500 rounded-2xl py-4 pl-12 pr-4 text-2xl font-semibold tracking-wide shadow-inner shadow-gray-950/40 focus:outline-none focus:ring-0"
              placeholder="0.00"
              value={bill}
              onChange={handleBillChange}
              onClick={moveCursorToEnd}
              onKeyUp={moveCursorToEnd}
            />
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">Quick Tip</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {presetTips.map((preset) => {
              const selected = tipPercentage === preset;
              return (
                <button
                  key={preset}
                  onClick={() => setTipPercentage(preset)}
                  style={
                    selected
                      ? { backgroundColor: ACCENT, color: "#fff" }
                      : { backgroundColor: ACCENT_TINT_BG, color: ACCENT_TEXT }
                  }
                  className="py-2.5 rounded-xl font-semibold transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {preset}%
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Tip Slider */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-400">Custom Tip</label>
            <span className="font-semibold" style={{ color: ACCENT_TEXT }}>{tipPercentage}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            style={{ accentColor: ACCENT }}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700"
            value={tipPercentage}
            onChange={(e) => setTipPercentage(parseFloat(e.target.value))}
          />
        </div>

        {/* Split Bill Stepper */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-400 mb-2">Number of People</label>
          <div className="flex items-center justify-center sm:justify-start space-x-3 sm:space-x-4">
            <button
              onClick={() => setSplit(Math.max(1, split - 1))}
              className="w-10 h-10 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 shadow-md shadow-gray-950/40 flex items-center justify-center text-xl font-medium transition-colors cursor-pointer"
            >
              -
            </button>
            <span className="text-xl font-semibold w-8 text-center text-white">{split}</span>
            <button
              onClick={() => setSplit(split + 1)}
              className="w-10 h-10 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 shadow-md shadow-gray-950/40 flex items-center justify-center text-xl font-medium transition-colors cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        {/* Rounding Controls */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            onClick={handleRoundDown}
            className="order-2 sm:order-1 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 font-medium transition-colors"
          >
            Round Total Down
          </button>
          <button
            onClick={handleRoundUp}
            className="order-1 sm:order-2 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 font-medium transition-colors"
          >
            Round Total Up
          </button>
        </div>
      </div>
    </div>
  );
}
