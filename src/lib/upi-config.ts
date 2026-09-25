// 🔧 EDIT THESE TO YOUR OWN UPI DETAILS
// Aap apni UPI ID yaha update kariye. Yahi QR aur UPI deep-link mein use hogi.
export const UPI_CONFIG = {
  upiId: "ramanthakur13135@okicici",
  payeeName: "Raman Thakur",
  amount: 899,
  note: "ID Card Studio Pro",
};

export function buildUpiUri(config = UPI_CONFIG) {
  const { upiId, payeeName, amount, note } = config;
  const params = new URLSearchParams({
    pa: upiId,
    pn: payeeName,
    am: String(amount),
    cu: "INR",
    tn: note,
  });
  return `upi://pay?${params.toString()}`;
}

export function buildUpiQrUrl(size = 240, config = UPI_CONFIG) {
  const data = encodeURIComponent(buildUpiUri(config));
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${data}`;
}
