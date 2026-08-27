// Pot 1 Imports
import psgLogo from '../assets/PSG_logosu.svg.webp';
import bmLogo from '../assets/FC_Bayern_München_logo_(2024).svg.webp';
import rmLogo from '../assets/Real_Madrid.png';
import livLogo from '../assets/150px-Liverpool_FC_logo.png';
import intLogo from '../assets/FC_Internazionale_Milano_2021.svg.webp';
import mcLogo from '../assets/Manchester_City.png';
import arsLogo from '../assets/Arsenal_Football_Club.png';
import barLogo from '../assets/FC_Barcelona.png';
import atlLogo from '../assets/Atlético_Madrid_logo.png';

// Pot 2 Imports
import bvbLogo from '../assets/Borussia_Dortmund_logo.svg.webp';
import romLogo from '../assets/AS_Roma_Logo_2017.png';
import spoLogo from '../assets/Sporting_Lizbon_logo.png';
import avlLogo from '../assets/Aston_Villa.png';
import porLogo from '../assets/FC.Porto.png';
import munLogo from '../assets/Manchester_United_FC_logo.png';
import cbLogo from '../assets/Club_Brugge.jpg';
import rbLogo from '../assets/Real_betis_logo.svg.webp';
import psvLogo from '../assets/330px-PSV_Eindhoven_-_Philips_Stadion_-_Kleedkamer_Welkom_-_Cropped_Logo.jpg';

// Pot 3 Imports
import gsLogo from '../assets/Galatasaray_SK_football_logo.png.webp';
import fbLogo from '../assets/Fenerbahçe_SK.png.webp';
import feyLogo from '../assets/Feyenoord_logo_since_2009.svg.webp';
import lilLogo from '../assets/Lilleoscyeni.png';
import bgLogo from '../assets/FK_Bodo_Glimt_logo.svg.webp';
import napLogo from '../assets/SSC_Napoli_2025_(white_and_azure).svg.webp';
import rblLogo from '../assets/RB_Leipzig_2014_logo.svg.webp';
import vilLogo from '../assets/Villarreal_CF_logo.png';
import shaLogo from '../assets/Şahtar_Donetsk.svg.webp';

// Pot 4 Imports
import vikLogo from '../assets/Viking_Stavanger.png';
import spLogo from '../assets/SK_Slavia_Praha_full_logo.svg.webp';
import sbLogo from '../assets/SK_Slovan_Bratislava_logo.svg.webp';
import stuLogo from '../assets/VfB_Stuttgart_1893_Logo.svg.webp';
import aekLogo from '../assets/AEK_Atina.png';
import llLogo from '../assets/LASK-Logo_2023.svg.webp';
import comLogo from '../assets/Calcio_Como_-_logo_(Italy,_2019-).svg.webp';
import rclLogo from '../assets/Rclensyeni.png';
import sabLogo from '../assets/sabah.webp';

// Rating hesaplama: 90+ = S, 85-89 = A, 80-84 = B, 75-79 = C, 70-74 = D, <70 = E
export const getRating = (val) => {
  if (val >= 90) return 'S';
  if (val >= 85) return 'A';
  if (val >= 80) return 'B';
  if (val >= 75) return 'C';
  if (val >= 70) return 'D';
  return 'E';
};

export const pots = {
  1: [
    { id: 'psg', name: 'PSG', country: 'FRA', logo: psgLogo, stats: { off: 89, def: 84, tac: 86, spd: 91, tec: 88, phy: 85 } },
    { id: 'bm', name: 'B. MÜNCHEN', country: 'GER', logo: bmLogo, stats: { off: 91, def: 85, tac: 88, spd: 88, tec: 90, phy: 87 } },
    { id: 'rm', name: 'R. MADRID', country: 'ESP', logo: rmLogo, stats: { off: 92, def: 86, tac: 90, spd: 92, tec: 91, phy: 86 } },
    { id: 'liv', name: 'LIVERPOOL', country: 'ENG', logo: livLogo, stats: { off: 88, def: 87, tac: 85, spd: 89, tec: 86, phy: 86 } },
    { id: 'int', name: 'INTER', country: 'ITA', logo: intLogo, stats: { off: 86, def: 88, tac: 87, spd: 84, tec: 85, phy: 85 } },
    { id: 'mc', name: 'M. CITY', country: 'ENG', logo: mcLogo, stats: { off: 90, def: 87, tac: 91, spd: 86, tec: 90, phy: 85 } },
    { id: 'ars', name: 'ARSENAL', country: 'ENG', logo: arsLogo, stats: { off: 87, def: 86, tac: 88, spd: 88, tec: 87, phy: 84 } },
    { id: 'bar', name: 'BARCELONA', country: 'ESP', logo: barLogo, stats: { off: 88, def: 84, tac: 87, spd: 87, tec: 89, phy: 82 } },
    { id: 'atl', name: 'ATLETICO', country: 'ESP', logo: atlLogo, stats: { off: 85, def: 89, tac: 84, spd: 83, tec: 84, phy: 88 } },
  ],
  2: [
    { id: 'bvb', name: 'B. DORTMUND', country: 'GER', logo: bvbLogo, stats: { off: 84, def: 82, tac: 83, spd: 86, tec: 84, phy: 83 } },
    { id: 'rom', name: 'ROMA', country: 'ITA', logo: romLogo, stats: { off: 83, def: 82, tac: 83, spd: 81, tec: 82, phy: 82 } },
    { id: 'spo', name: 'SPORTING', country: 'POR', logo: spoLogo, stats: { off: 83, def: 81, tac: 82, spd: 85, tec: 83, phy: 80 } },
    { id: 'avl', name: 'A. VILLA', country: 'ENG', logo: avlLogo, stats: { off: 84, def: 81, tac: 83, spd: 84, tec: 82, phy: 83 } },
    { id: 'por', name: 'PORTO', country: 'POR', logo: porLogo, stats: { off: 82, def: 83, tac: 81, spd: 82, tec: 81, phy: 84 } },
    { id: 'mun', name: 'M. UNITED', country: 'ENG', logo: munLogo, stats: { off: 84, def: 82, tac: 84, spd: 85, tec: 83, phy: 83 } },
    { id: 'cb', name: 'C. BRUGGE', country: 'BEL', logo: cbLogo, stats: { off: 79, def: 78, tac: 79, spd: 80, tec: 78, phy: 78 } },
    { id: 'rb', name: 'R. BETIS', country: 'ESP', logo: rbLogo, stats: { off: 82, def: 80, tac: 82, spd: 81, tec: 82, phy: 80 } },
    { id: 'psv', name: 'PSV', country: 'NED', logo: psvLogo, stats: { off: 81, def: 79, tac: 80, spd: 82, tec: 80, phy: 80 } },
  ],
  3: [
    { id: 'gs', name: 'GALATASARAY', country: 'TUR', logo: gsLogo, stats: { off: 81, def: 78, tac: 79, spd: 80, tec: 80, phy: 79 } },
    { id: 'fb', name: 'FENERBAHÇE', country: 'TUR', logo: fbLogo, stats: { off: 80, def: 78, tac: 80, spd: 81, tec: 79, phy: 78 } },
    { id: 'fey', name: 'FEYENOORD', country: 'NED', logo: feyLogo, stats: { off: 79, def: 78, tac: 78, spd: 80, tec: 78, phy: 79 } },
    { id: 'lil', name: 'LILLE', country: 'FRA', logo: lilLogo, stats: { off: 79, def: 77, tac: 78, spd: 81, tec: 78, phy: 77 } },
    { id: 'bg', name: 'BODO/GLIMT', country: 'NOR', logo: bgLogo, stats: { off: 76, def: 74, tac: 75, spd: 77, tec: 74, phy: 76 } },
    { id: 'nap', name: 'NAPOLI', country: 'ITA', logo: napLogo, stats: { off: 83, def: 80, tac: 81, spd: 82, tec: 82, phy: 80 } },
    { id: 'rbl', name: 'LEIPZIG', country: 'GER', logo: rblLogo, stats: { off: 82, def: 80, tac: 81, spd: 84, tec: 81, phy: 80 } },
    { id: 'vil', name: 'VILLARREAL', country: 'ESP', logo: vilLogo, stats: { off: 80, def: 79, tac: 80, spd: 80, tec: 81, phy: 78 } },
    { id: 'sha', name: 'SHAKHTAR', country: 'UKR', logo: shaLogo, stats: { off: 78, def: 76, tac: 77, spd: 78, tec: 77, phy: 76 } },
  ],
  4: [
    { id: 'vik', name: 'VIKING', country: 'NOR', logo: vikLogo, stats: { off: 72, def: 71, tac: 72, spd: 72, tec: 71, phy: 73 } },
    { id: 'sp', name: 'SLAVIA PRAG', country: 'CZE', logo: spLogo, stats: { off: 76, def: 75, tac: 75, spd: 75, tec: 74, phy: 76 } },
    { id: 'sb', name: 'S. BRATISLAVA', country: 'SVK', logo: sbLogo, stats: { off: 74, def: 73, tac: 73, spd: 73, tec: 72, phy: 74 } },
    { id: 'stu', name: 'STUTTGART', country: 'GER', logo: stuLogo, stats: { off: 80, def: 78, tac: 79, spd: 81, tec: 79, phy: 79 } },
    { id: 'aek', name: 'AEK ATINA', country: 'GRE', logo: aekLogo, stats: { off: 75, def: 74, tac: 75, spd: 76, tec: 74, phy: 74 } },
    { id: 'll', name: 'LASK LINZ', country: 'AUT', logo: llLogo, stats: { off: 73, def: 72, tac: 73, spd: 74, tec: 72, phy: 72 } },
    { id: 'com', name: 'COMO', country: 'ITA', logo: comLogo, stats: { off: 75, def: 74, tac: 74, spd: 75, tec: 74, phy: 73 } },
    { id: 'rcl', name: 'RC LENS', country: 'FRA', logo: rclLogo, stats: { off: 78, def: 77, tac: 77, spd: 79, tec: 77, phy: 78 } },
    { id: 'sab', name: 'SABAH', country: 'AZE', logo: sabLogo, stats: { off: 70, def: 69, tac: 70, spd: 71, tec: 69, phy: 70 } },
  ]
};

export const allTeams = [
  ...pots[1],
  ...pots[2],
  ...pots[3],
  ...pots[4]
];
