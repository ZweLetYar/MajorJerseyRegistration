export function getQR(year: string) {
  const map: Record<string, string> = {
    "1st year": "/qr1.jpg",
    "2nd year": "/qr1.jpg",
    "3rd year": "/qr2.jpg",
    "4th year": "/qr2.jpg",
    "5th year(first sem)": "/qr3.jpg",
    "5th year(second sem)": "/qr3.jpg",
    "6th year": "/qr3.jpg",
  };

  return map[year] || "/qr/default.png";
}
