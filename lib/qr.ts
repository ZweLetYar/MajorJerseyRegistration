export function getQR(year: string) {
  const map: Record<string, string> = {
    "1st": "/qr1.jpg",
    "2nd": "/qr2.jpg",
    "3rd": "/qr3.jpg",
  };

  return map[year] || "/qr/default.png";
}
