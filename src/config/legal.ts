// Legal identity and compliance data used by the privacy notice and the terms
// of use.
//
// RULE: anything the client has not confirmed in writing stays as PENDING.
// Publishing an invented legal name, RFC, address or ARCO mailbox is a worse
// compliance problem than publishing nothing, because it misleads the data
// subject about who is responsible and where to exercise their rights.
//
// Replacing a value here updates every legal page at once.

import { BUSINESS } from "@/config/business";

/** Visible marker so an unconfirmed value can never be mistaken for a real one. */
export const PENDING = "[PENDIENTE DE CONFIRMAR]";

export const isPending = (value: string) => value === PENDING;

export const LEGAL = {
  /** Commercial name already in use across the site. */
  tradeName: BUSINESS.name,

  /** Nombre del responsable. Confirmado por el cliente el 11/08/2026. */
  legalName: "Karen Lucía Ríos Reséndiz",

  /**
   * RFC del responsable. Confirmado por el cliente el 11/08/2026.
   *
   * Nota para quien mantenga esto: aquí va el RFC (13 posiciones), nunca el
   * CURP (18). El CURP revela fecha de nacimiento, sexo y entidad, que es más
   * de lo necesario para identificar al responsable, y es un dato personal
   * suyo que no tiene por qué publicarse en el sitio.
   */
  rfc: "RIRK910528FQ5",

  /**
   * Domicilio para oír y recibir notificaciones y solicitudes ARCO.
   * Confirmado por el cliente el 11/08/2026. Se normalizaron acentos y
   * mayúsculas; conviene cotejar la calle contra la constancia de situación
   * fiscal, porque el domicilio legal debe coincidir con el registro oficial.
   */
  address:
    "FC Terraplén San Rafael 7, Col. Los Ángeles Apanoaya, " +
    "Alcaldía Iztapalapa, C.P. 09710, Ciudad de México, CDMX",

  /**
   * Buzón que atiende solicitudes ARCO. Creado por el cliente el 11/08/2026.
   * Es un alias de dominio propio, no el correo personal de nadie, para que
   * siga funcionando aunque cambie el personal que lo atiende.
   */
  privacyEmail: "privacidad@coplastdemexico.com",

  // No se nombra a una persona para atender solicitudes ARCO: el cliente
  // prefiere que el punto de contacto sea únicamente el correo, lo cual es
  // válido y además sobrevive a los cambios de personal.

  /** Entidad federativa cuya jurisdicción se pacta. Confirmada el 11/08/2026. */
  jurisdiction: "la Ciudad de México",

  /**
   * Plazo de conservación de las cotizaciones. Definido por el cliente el
   * 11/08/2026.
   *
   * OJO: hoy esto es solo una declaración. Nada en el código borra las
   * cotizaciones de Netlify Blobs, así que el sitio promete un plazo que no
   * cumple. Falta implementar la depuración en netlify/lib/quote-storage.mjs.
   */
  retentionPeriod: "3 meses contados a partir de su emisión",

  /**
   * Proveedor de correo saliente. Confirmado el 11/08/2026: SMTP_HOST apunta a
   * smtp.gmail.com. Se nombra a Google, no el host, porque el aviso lo lee una
   * persona y no un administrador de sistemas.
   */
  emailProvider: "Google, a través de su servicio Gmail",

  // El teléfono no se duplica aquí: el cliente confirmó el 5625289330, que es
  // el mismo de BUSINESS.phone. Las páginas legales lo leen de ahí para que no
  // puedan quedar desincronizadas.

  /** Fecha de última actualización mostrada al pie de cada documento legal. */
  lastUpdated: "11 de agosto de 2026",
  /** La misma fecha en ISO, para el atributo dateTime de <time>. */
  lastUpdatedISO: "2026-08-11",
} as const;
