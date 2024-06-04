////////////////////////////////////////////////////////////////////////////////////////

export default function historial() {
    console.log("Función historial");
}


function getCurrentDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const mins = String(date.getMinutes()).padStart(2, '0');
    const secs = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${mins}:${secs}`;
}

// funció que actualitza la cookie, afegint la informació de la jugada, ordinador i resultat
// afegim el timestamp actual
// la cookie sempre es guarda en JSON
export function updateCookie(apuesta, resultado, saldo) {
    let cookie = Astro.cookies.get("ruleta");
    let cookieData = JSON.parse(cookie.value);
    const currentDate = getCurrentDate();
    cookieData.push({
        currentDate,
        apuesta,
        resultado,
        saldo
    });
    Astro.cookies.set("ruleta", JSON.stringify(cookieData), { path: '/' });
}