// 🔧 EDIT THESE TO YOUR OWN UPI DETAILS
// Aap apni UPI ID yaha update kariye. Yahi QR aur UPI deep-link mein use hogi.
export const UPI_CONFIG = {
  upiId: "yourname@okhdfc",        // <-- replace with your real UPI ID
  payeeName: "ID Card Studio",     // shown in payee's UPI app
  amount: 899,                      // INR
  note: "ID Card Studio Pro",
};

export function buildUpiUri() {
  const { upiId, payeeName, amount, note } = UPI_CONFIG;
  const params = new URLSearchParams({
    pa: upiId,
    pn: payeeName,
    am: String(amount),
    cu: "INR",
    tn: note,
  });
  return `upi://pay?${params.toString()}`;
}

export function buildUpiQrUrl(size = 240) {
  const data = encodeURIComponent(buildUpiUri());
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${data}`;
}
