
Problem ka root cause preview vs PDF rendering difference hai:

- Preview mein browser direct `<img>` se `logoDataUrl` aur `signatureDataUrl` dikha deta hai.
- PDF export mein `jsPDF.addImage()` use ho raha hai, jo raw uploaded image formats + rotated export path dono ke saath brittle hai.
- Current code mein do risky points hain:
  1. `StepDesign.tsx` raw file ko direct Data URL ke form mein store kar raha hai, chahe wo PNG/JPEG ho ya WEBP/SVG.
  2. `StepExport.tsx` default `autoRotate=true` ke saath `withRotatedCard()` use karta hai, aur rotated PDF path mein image assets unreliable ho rahe hain.

## Fix plan

### 1. Logo/signature upload ko PDF-safe format mein normalize karna
File: `src/components/idcard/StepDesign.tsx`

- Logo aur signature upload ke time raw file ko direct store nahi karunga.
- Har uploaded design asset ko browser canvas ke through **PNG data URL** mein normalize karke `setDesign()` mein save karunga.
- Isse preview aur PDF dono same, stable asset format use karenge.
- SVG/WEBP/transparent PNG jaise cases bhi controlled ho jayenge.

Expected result:
- Jo image preview mein dikhegi, wahi PDF ke liye bhi ek safe raster format mein available hogi.

### 2. PDF image helper ko robust banana
File: `src/lib/cardDraw.ts`

- `tryAddImage()` ko upgrade karunga taaki:
  - actual mime type safely parse ho
  - unsupported input ko fallback-converted PNG ke through handle kare
  - wrong format guess ke saath `addImage()` call na ho
- Small cache/helper add karunga taaki same logo/signature har card pe dubara expensive conversion na kare.

Expected result:
- Logo/signature/custom background/custom signature elements sab PDF mein consistent render honge.

### 3. Rotated export path ko stable banana
Files:
- `src/components/idcard/StepExport.tsx`
- `src/lib/cardDraw.ts`

Current issue ka strong suspect `withRotatedCard()` + image drawing combo hai.

Implementation:
- Export rotation path ko safe banaunga so that images CTM/advanced transform ki wajah se vanish na hon.
- Agar current matrix-based approach reliable na ho, rotated mode ke liye safer rendering path use karunga.
- Immediate UX safety ke liye `autoRotate` ko default off karunga jab tak verified stable behavior confirm na ho.

Expected result:
- Non-rotated export first-time reliable rahe.
- Rotated export bhi logo/signature missing ki problem ke bina chale.

### 4. Built-in + custom dono modes cover karna
Files affected by shared fix:
- `src/lib/cardDraw.ts`
- existing template exports indirectly

Ye fix in sab pe lagega:
- `vertical-classic`
- `vertical-modern`
- `horizontal-classic`
- `horizontal-modern`
- `custom`

Kyuki sab PDF export ke waqt same image helper use karte hain.

## QA plan

Implementation ke baad in scenarios ko verify karunga:

1. Vertical classic preview vs PDF
2. Vertical modern preview vs PDF
3. Custom mode preview vs PDF
4. School logo present / absent
5. Principal signature present / absent
6. Auto-rotate off
7. Auto-rotate on
8. PNG/JPEG upload
9. SVG/WEBP upload if available

Success criteria:
- Preview mein jo logo/signature visible hai, PDF mein bhi visible ho
- Missing-image issue na aaye
- Layout shift/corruption na ho
- Auto-rotate on/off dono mein export usable rahe

## Files to update

- `src/components/idcard/StepDesign.tsx` — upload-time image normalization
- `src/lib/cardDraw.ts` — safer PDF image pipeline + rotation-safe rendering
- `src/components/idcard/StepExport.tsx` — safer export defaults / rotation handling
