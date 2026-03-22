const LEVELS = [
  { id: 1, image: require('@/assets/images/nivel_1.png'), image2: require('@/assets/images/nivel_1E.png') },
  { id: 2, image: require('@/assets/images/nivel_2.png'), image2: require('@/assets/images/nivel_2E.png') },
  { id: 3, image: require('@/assets/images/nivel_3.png'), image2: require('@/assets/images/nivel_3E.png') },
  { id: 4, image: require('@/assets/images/nivel_4.png'), image2: require('@/assets/images/nivel_4E.png') },
  { id: 5, image: require('@/assets/images/nivel_5.png'), image2: require('@/assets/images/nivel_5E.png') },
  { id: 6, image: require('@/assets/images/nivel_6.png'), image2: require('@/assets/images/nivel_6E.png') },
  { id: 7, image: require('@/assets/images/nivel_7.png'), image2: require('@/assets/images/nivel_7E.png') },
];

const ABOUT_THE_RESOURCE_HTML = `
  <section>
    <h1>Acerca de este Recurso</h1>
    <p>
      El presente sitio web forma parte de los recursos pensados especialmente para los miembros 
      del pueblo bribri. Se tomó como base el material <b>“Ù. Diccionario pictográfico de la casa tradicional bribri”</b>, 
      el cual, a su vez, se elaboró a partir de la documentación lingüística realizada por la 
      Dra. Carla Jara Murillo que fue publicada en <i>“El campo léxico de la vivienda en el bribri de Corona”</i> 
      (Estudios de Lingüística Chibcha, VI, 1987).
    </p>
    <p>
      Con el fin de promover una mayor interacción de las personas usuarias con el contenido de dicho material, 
      se presenta aquí un recurso que, además de presentar la información, ofrece la posibilidad de autoevaluarse 
      por medio de tareas simples: por una parte, asociación de imágenes y palabras escritas; por otra parte, 
      asociación de audios con imágenes. Para cada página del material original, entonces, se generaron dos 
      posibilidades de practicar jugando.
    </p>
  </section>
`;

const ABOUT_THE_PROJECT_HTML = `
  <section>
    <h1>Sobre el proyecto TC-625</h1>
    <p>
      El proyecto de trabajo comunal universitario <b>TC-625 “Lenguas y tradiciones orales de Costa Rica”</b>, 
      adscrito a la Escuela de Filología, Lingüística y Literatura y a la Vicerrectoría de Acción Social 
      de la Universidad de Costa Rica, colabora con diversas comunidades etnolingüísticas de Costa Rica con 
      el objetivo de fortalecer la presencia de sus lenguas y culturas autóctonas.
    </p>
    <p>
      Uno de los propósitos más importantes del proyecto es la creación de recursos didácticos y de consulta 
      adecuados para la población y elaborados con criterios técnicos de diseño gráfico, lingüística aplicada 
      y uso de nuevas tecnologías. El presente sitio web constituye una muestra de esta forma de proceder.
    </p>
    <p style="margin-top: 20px;">
      <b>Luis Serrato Pineda</b><br>
      Coordinador del proyecto<br>
      Universidad de Costa Rica<br>
      Contacto: <a href="mailto:dipalicori@ucr.ac.cr">dipalicori@ucr.ac.cr</a><br>
      2026
    </p>
  </section>
`;

const CREDITS_HTML = `
  <section>
    <h1>Créditos</h1>
    <div style="margin-bottom: 15px;">
      <b>Desarrollo del sitio web</b>
      <p>Alexánder Quesada Quesada, Allison Foster McLeod, Joseph Nuñez Solano y Pablo Hernández Bonilla (primera versión).</p>
      <p>Evan Chen Cheng (ajustes a la primera versión y versión final).</p>
    </div>

    <div style="margin-bottom: 15px;">
      <b>Elementos de diseño gráfico</b>
      <p>Víctor Mora Mora y Laura Jiménez Cubillo</p>
    </div>

    <div style="margin-bottom: 15px;">
      <b>Asesoría lingüístico-cultural y voz de los audios</b>
      <p>Alí García Segura</p>
    </div>

    <div style="margin-bottom: 15px;">
      <b>Diseño y revisión del recurso, y coordinación general del proceso</b>
      <p>Luis Serrato Pineda</p>
    </div>

    <div style="margin-bottom: 15px;">
      <b>Diseño e ilustraciones del material base</b>
      <p>Diego Zúñiga Espinoza</p>
    </div>

    <p style="text-align: center; margin-top: 20px;">2026</p>
  </section>
`;

export { LEVELS, ABOUT_THE_RESOURCE_HTML, ABOUT_THE_PROJECT_HTML, CREDITS_HTML};