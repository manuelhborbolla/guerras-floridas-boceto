// Este es un prototipo integrado con selección de ejército, campo de batalla y combate
import React, { useState } from "react";
import { motion } from "framer-motion";

const tribus = ["Mexica", "Vikingo", "Samurái", "Yoruba"];
const accionesDisponibles = ["Mover", "Atacar", "Habilidad", "Esperar"];
const gridSize = 60;
const tileSize = 16;

const unidadBase = {
  nombre: "Guerrero Jaguar",
  hp: 100,
  mp: 40,
  ataque: 20,
  defensa: 10,
  movilidad: 6,
  alcance: 1,
  estado: "Normal",
  habilidades: ["Zarpazo", "Rugido"],
  posicion: { x: 30, y: 30 }
};

const terrenoEjemplo = ["Llanura", "Bosque", "Montaña", "Agua", "Ciudad"];
const efectosTerreno = {
  Llanura: { mov: 1, def: 0, vis: 0, dmg: 0 },
  Bosque: { mov: 2, def: 2, vis: -1, dmg: -0.1 },
  Montaña: { mov: 3, def: 3, vis: -2, dmg: 0.15 },
  Agua: { mov: 99, def: 0, vis: -2, dmg: -0.25 },
  Ciudad: { mov: 1, def: 1, vis: 0, dmg: 0 }
};

export default function App() {
  const [fase, setFase] = useState("seleccion");
  const [tribuSeleccionada, setTribuSeleccionada] = useState(null);
  const [accion, setAccion] = useState(null);
  const [casillaSeleccionada, setCasillaSeleccionada] = useState(null);
  const [unidad] = useState(unidadBase);

  const renderizarCasilla = (x, y) => {
    const terreno = terrenoEjemplo[(x + y) % terrenoEjemplo.length];
    const efectos = efectosTerreno[terreno];
    const distancia = Math.abs(x - unidad.posicion.x) + Math.abs(y - unidad.posicion.y);
    const mover = distancia <= (unidad.movilidad - (efectos.mov - 1));
    const atacar = distancia === unidad.alcance;
    const habilidad = distancia <= 3 + efectos.vis && distancia > 0;

    let color = "bg-gray-100";
    if (accion === "Mover" && mover) color = "bg-green-300";
    if (accion === "Atacar" && atacar) color = "bg-red-300";
    if (accion === "Habilidad" && habilidad) color = "bg-purple-300";

    const seleccion = casillaSeleccionada?.x === x && casillaSeleccionada?.y === y;

    return (
      <div
        key={\`\${x}-\${y}\`}
        onClick={() => setCasillaSeleccionada({ x, y, terreno, efectos })}
        className={\`w-[\${tileSize}px] h-[\${tileSize}px] border border-gray-300 flex items-center justify-center text-[10px] cursor-pointer \${color} \${seleccion ? "ring-2 ring-yellow-400" : ""}\`}
        title={\`Terreno: \${terreno}\`}
      >
        {x === unidad.posicion.x && y === unidad.posicion.y ? "🧍" : ""}
      </div>
    );
  };

  const preview = () => {
    if (!casillaSeleccionada) return null;
    const base = unidad.ataque;
    const mod = Math.round(base * casillaSeleccionada.efectos.dmg);
    return base + mod;
  };

  if (fase === "seleccion") {
    return (
      <div className="p-4 text-center">
        <h1 className="text-xl font-bold mb-4">Selecciona tu tribu</h1>
        <div className="flex justify-center gap-4">
          {tribus.map((t) => (
            <motion.button
              key={t}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setTribuSeleccionada(t);
                setFase("combate");
              }}
              className="px-4 py-2 bg-blue-200 rounded hover:bg-blue-300"
            >
              {t}
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 grid grid-cols-4 gap-4">
      <div className="col-span-1 space-y-4">
        <div className="p-4 border rounded bg-white shadow">
          <h2 className="font-bold text-lg mb-2">Unidad</h2>
          <p>Nombre: {unidad.nombre}</p>
          <p>HP: {unidad.hp}</p>
          <p>MP: {unidad.mp}</p>
          <p>ATK: {unidad.ataque}</p>
          <p>DEF: {unidad.defensa}</p>
        </div>

        <div className="p-4 border rounded bg-white shadow">
          <h2 className="font-bold text-lg mb-2">Acciones</h2>
          {accionesDisponibles.map((a) => (
            <motion.button
              key={a}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAccion(a)}
              className={\`w-full mb-1 px-3 py-1 rounded \${accion === a ? "bg-blue-500 text-white" : "bg-gray-200"}\`}
            >
              {a}
            </motion.button>
          ))}
        </div>

        <div className="p-4 border rounded bg-white shadow text-sm">
          {casillaSeleccionada && (
            <>
              <p><strong>Casilla:</strong> ({casillaSeleccionada.x}, {casillaSeleccionada.y})</p>
              <p><strong>Terreno:</strong> {casillaSeleccionada.terreno}</p>
              <p><strong>Mov:</strong> +{casillaSeleccionada.efectos.mov}</p>
              <p><strong>Def:</strong> +{casillaSeleccionada.efectos.def}</p>
              <p><strong>Mod Daño:</strong> {preview()}</p>
            </>
          )}
        </div>
      </div>

      <div className="col-span-3">
        <div className="overflow-auto border">
          <div
            className="grid"
            style={{ display: "grid", gridTemplateColumns: \`repeat(\${gridSize}, \${tileSize}px)\` }}
          >
            {[...Array(gridSize)].flatMap((_, x) =>
              [...Array(gridSize)].map((_, y) => renderizarCasilla(x, y))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
