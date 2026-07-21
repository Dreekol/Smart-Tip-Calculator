"use client";

import { useState } from "react";

// Buttons/slider use the standard blue-600; numeric text uses a lighter blue-300
// for sufficient contrast against the dark background (WCAG AA).
const ACCENT = "#2563eb";
const ACCENT_TEXT = "#93c5fd";
const ACCENT_TINT_BG = "#1f2937";

const isWhole = (n) => Math.abs(n - Math.round(n)) < 0.005;

export default function TipCalculator() {
  const [bill, setBill] = useState("");
  const [tipPercentage, setTipPercentage] = useState(15);
  const [split, setSplit] = useState(1);

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
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-gray-900 rounded-2xl shadow-xl p-4 sm:p-6 w-full max-w-md">
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-5 sm:mb-6 text-center">Smart Tip Calculator</h1>

        {/* Results Block */}
        <div className="sticky top-0 z-10 bg-gray-800 rounded-xl p-4 sm:p-5 border border-gray-700 mb-4 sm:static">
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
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl py-3 pl-8 pr-4 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="0.00"
              value={bill}
              onChange={(e) => setBill(e.target.value)}
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
                  className="py-2 rounded-lg font-medium transition-colors"
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
              className="w-10 h-10 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 flex items-center justify-center text-xl font-medium transition-colors cursor-pointer"
            >
              -
            </button>
            <span className="text-xl font-semibold w-8 text-center text-white">{split}</span>
            <button
              onClick={() => setSplit(split + 1)}
              className="w-10 h-10 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 flex items-center justify-center text-xl font-medium transition-colors cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        {/* Rounding Controls */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            onClick={handleRoundDown}
            className="py-2.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 font-medium transition-colors"
          >
            Round Total Down
          </button>
          <button
            onClick={handleRoundUp}
            className="py-2.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 font-medium transition-colors"
          >
            Round Total Up
          </button>
        </div>
      </div>
    </div>
  );
}
