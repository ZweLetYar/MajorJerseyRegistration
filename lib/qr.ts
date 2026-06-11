export function getQR(year: string) {
  const map: Record<string, string> = {
    "1st": "/qr/first-year.png",
    "2nd": "/qr/second-year.png",
    "3rd": "/qr/third-year.png",
  };

  return map[year] || "/qr/default.png";
}
