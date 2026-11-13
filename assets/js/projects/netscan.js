/* ==========================================================================
   Project: NetScan
   Slug "netscan" — source: project-intake/netscan/.
   One project per file. Each file appends its object to window.PROJECTS;
   index.html loads these files before app.js, which then sorts them by `date`
   (newest first). See README.md in this folder.
   ========================================================================== */

(window.PROJECTS = window.PROJECTS || []).push(
  {
    slug: "netscan", context: "individual", featured: true, article: false,
    // Sort key (newest first): ISO "YYYY-MM" or "YYYY-MM-DD".
    date: "2025-07",
    // Optional thumbnail: shown on the Home card and as the project page hero,
    // replacing the terminal graphic. Recommended 16:10 or wider, ≤ 1400 px.
    // Any browser-supported format works (WebP, PNG, JPEG); WebP/JPEG is lighter.
    thumb: { src: "assets/img/projects/netscan/thumbnail.webp", w: 1400, h: 876,
   alt: { fr: "Vignette du projet NetScan, un outil de scan réseau développé en Bash autour de Nmap.",
          en: "Portfolio thumbnail for NetScan, a Bash-based network scanning tool built around Nmap." } },
    name: "NetScan",
    summary: {
      fr: "Outil Bash pour découvrir les hôtes, analyser les ports et services et détecter les vulnérabilités réseau.",
      en: "Bash tool for host discovery, port and service analysis, and network vulnerability scanning."
    },
    lead: {
      fr: "Outil d'analyse réseau en ligne de commande, écrit en Bash, qui réunit la découverte d'hôtes, l'identification des systèmes et services, l'analyse des ports et la détection de vulnérabilités derrière un menu interactif unique.",
      en: "A command-line network analysis tool written in Bash that brings host discovery, operating system and service identification, port scanning and vulnerability detection together behind a single interactive menu."
    },
    period: { fr: "Juillet 2025", en: "July 2025" },
    status: { fr: "Terminé", en: "Completed" },
    // Verified from netscan.sh: five menu scan options, three output formats per Nmap
    // scan (TXT + XML, then HTML via xsltproc), and three external tools called
    // (nmap, nbtscan, xsltproc).
    stats: [
      { value: "5", label: { fr: "Types de scans", en: "Scan types" } },
      { value: "3", label: { fr: "Formats de sortie", en: "Output formats" } },
      { value: "3", label: { fr: "Outils orchestrés", en: "Orchestrated tools" } }
    ],
    // How the script works, shown as a one-line strip: the target is validated,
    // the chosen scan runs, results land in a timestamped folder, then the XML is
    // turned into an HTML report.
    phases: [
      { fr: "Cible", en: "Target" },
      { fr: "Scan", en: "Scan" },
      { fr: "Fichiers", en: "Files" },
      { fr: "Rapport", en: "Report" }
    ],
    tech: ["Bash", "Nmap", "nbtscan", "xsltproc", "Linux"],
    links: { repo: "https://github.com/ii0ns/netscan", demo: null, report: null },
    blocks: [
      {
        title: { fr: "Objectif", en: "Goal" },
        body: {
          fr: "Fournir un outil en ligne de commande qui simplifie la reconnaissance et l'analyse réseau en réunissant plusieurs opérations de scan dans une seule interface interactive. L'outil accepte un sous-réseau IPv4 en notation CIDR et permet de choisir le type de scan à exécuter.",
          en: "Provide a command-line tool that simplifies network reconnaissance and analysis by bringing several scanning operations together in a single interactive interface. The tool accepts an IPv4 subnet in CIDR notation and lets the user choose which type of scan to run."
        },
        figure: {
          src: "assets/img/projects/netscan/menu.webp", w: 1400, h: 1117,
          alt: {
            fr: "Menu principal de NetScan dans un terminal, avec les cinq options de scan.",
            en: "NetScan's main menu in a terminal, with the five scan options."
          },
          caption: {
            fr: "Le menu du script au lancement.",
            en: "The script's menu on launch."
          }
        }
      },
      {
        title: { fr: "Prérequis", en: "Requirements" }, type: "list",
        body: {
          fr: [
            "Linux avec Bash, à lancer en root.",
            "nmap et xsltproc.",
            "nbtscan (facultatif, uniquement pour le scan NetBIOS)."
          ],
          en: [
            "Linux with Bash, run as root.",
            "nmap and xsltproc.",
            "nbtscan (optional, only for the NetBIOS scan)."
          ]
        },
        codeNote: { fr: "Sur Debian ou Kali :", en: "On Debian or Kali:" },
        code: { label: "bash", text: "sudo apt install nmap xsltproc nbtscan" }
      },
      {
        title: { fr: "Utilisation", en: "Usage" },
        code: { label: "bash", text: "chmod +x netscan.sh\nsudo ./netscan.sh" },
        after: {
          fr: "Saisir un réseau en notation CIDR (par exemple 192.168.1.0/24), puis choisir un scan.",
          en: "Enter a network in CIDR notation (for example 192.168.1.0/24), then pick a scan."
        }
      },
      {
        title: { fr: "Fonctionnalités", en: "Features" }, type: "list",
        body: {
          fr: [
            "Menu interactif en ligne de commande proposant cinq types de scans.",
            "Saisie d'un sous-réseau IPv4 en notation CIDR.",
            "Découverte d'hôtes avec Nmap (-sn).",
            "Scan standard pour la détection des versions de services et du système d'exploitation (-sV, -O).",
            "Scan complet de tous les ports TCP (-p-) avec détection agressive (-A).",
            "Scan de vulnérabilités via la catégorie de scripts NSE « vuln » de Nmap.",
            "Scan des noms NetBIOS avec nbtscan.",
            "Création automatique de dossiers horodatés pour les résultats.",
            "Export des résultats en TXT et en XML.",
            "Conversion du XML en rapport HTML avec xsltproc lorsque c'est applicable.",
            "Restauration automatique du propriétaire des fichiers après une exécution privilégiée.",
            "Gestion des interruptions via les signaux SIGINT et SIGTERM."
          ],
          en: [
            "Interactive command-line menu with five scan types.",
            "IPv4 subnet input in CIDR notation.",
            "Host discovery with Nmap (-sn).",
            "Standard scan for service version and operating system detection (-sV, -O).",
            "Full scan of all TCP ports (-p-) with aggressive detection (-A).",
            "Vulnerability scanning through Nmap's vuln NSE script category.",
            "NetBIOS name scanning with nbtscan.",
            "Automatic creation of timestamped folders for scan results.",
            "Export of results as TXT and XML.",
            "XML-to-HTML report conversion with xsltproc where applicable.",
            "Automatic restoration of file ownership after a privileged run.",
            "Interruption handling through SIGINT and SIGTERM traps."
          ]
        }
      },
      {
        title: { fr: "Limites", en: "Limitations" }, type: "list",
        body: {
          fr: [
            "Nécessite les privilèges root pour s'exécuter.",
            "N'accepte que des adresses IPv4 au format CIDR.",
            "Le scan NetBIOS vise les hôtes Windows/Samba.",
            "Le scan de vulnérabilités s'appuie sur les scripts de vulnérabilité existants de Nmap.",
            "Aucune interface graphique : l'interaction se fait en ligne de commande.",
            "Aucune planification automatique des scans ni surveillance continue du réseau.",
            "Aucun tableau de bord ni base de données centralisée pour conserver l'historique des scans.",
            "La validation vérifie le format CIDR, mais pas que les octets de l'adresse IP et le préfixe du sous-réseau sont dans leurs plages numériques valides."
          ],
          en: [
            "Requires root privileges to run.",
            "Accepts IPv4 CIDR input only.",
            "NetBIOS scanning targets Windows/Samba hosts.",
            "Vulnerability scanning relies on Nmap's existing vulnerability scripts.",
            "No graphical interface: interaction is command-line based.",
            "No automated scan scheduling or continuous network monitoring.",
            "No dashboard or centralised database to keep scan history.",
            "Input validation checks the CIDR format, but not that the IP octets and subnet prefix are within their valid numeric ranges."
          ]
        }
      },
      {
        title: { fr: "Ce que j'ai appris", en: "What I learned" }, type: "list",
        body: {
          fr: [
            "Expérience pratique du scripting Bash et de l'automatisation en ligne de commande sous Linux.",
            "Meilleure compréhension de la reconnaissance réseau, du scan de ports, de la détection de services et de l'identification du système d'exploitation.",
            "Intégration d'outils de sécurité externes dans un flux de travail unifié.",
            "Gestion des privilèges root, des interruptions de processus, des codes de sortie et de l'organisation des résultats de scan.",
            "Améliorations envisagées : validation des entrées, vérification des dépendances, gestion des erreurs et modularité.",
            "Extensions possibles : prise en charge d'IPv6 et configurations de scan plus flexibles."
          ],
          en: [
            "Hands-on experience with Bash scripting and Linux command-line automation.",
            "A better understanding of network reconnaissance, port scanning, service detection and operating system identification.",
            "Integrating external security tools into a unified workflow.",
            "Handling root privileges, process interruptions, exit codes and scan output organisation.",
            "Would improve: input validation, dependency checks, error handling and modularity.",
            "Could extend with IPv6 support and more flexible scan configurations."
          ]
        }
      }
    ],
    gallery: [
      {
        src: "assets/img/projects/netscan/scan.webp", w: 1400, h: 800,
        alt: {
          fr: "Résultats d'une découverte d'hôtes affichés dans le terminal.",
          en: "Host discovery results displayed in the terminal."
        },
        caption: {
          fr: "Résultats d'un scan de découverte d'hôtes dans le terminal.",
          en: "Host discovery scan results in the terminal."
        }
      },
      {
        src: "assets/img/projects/netscan/output.webp", w: 1400, h: 937,
        alt: {
          fr: "Dossier de résultats contenant les fichiers TXT et XML générés par un scan de vulnérabilités.",
          en: "Results folder containing the TXT and XML files generated by a vulnerability scan."
        },
        caption: {
          fr: "Les fichiers de sortie générés, ici pour un scan de vulnérabilités.",
          en: "The generated output files, here for a vulnerability scan."
        }
      },
      {
        src: "assets/img/projects/netscan/report.webp", w: 1400, h: 832,
        alt: {
          fr: "Rapport HTML généré à partir du XML de Nmap, affichant les résultats d'un scan de vulnérabilités.",
          en: "HTML report generated from Nmap XML, showing the results of a vulnerability scan."
        },
        caption: {
          fr: "Le rapport HTML généré, ici pour un scan de vulnérabilités.",
          en: "The generated HTML report, here for a vulnerability scan."
        }
      }
    ],
    disclaimer: {
      fr: "NetScan est développé à des fins éducatives et pour des évaluations de sécurité réseau autorisées uniquement. Il ne doit être utilisé que sur des réseaux et systèmes que vous possédez ou pour lesquels vous disposez d'une autorisation explicite. Un scan non autorisé peut enfreindre les lois et réglementations applicables. Le développeur décline toute responsabilité en cas de mauvaise utilisation de cet outil ou de dommage en résultant.",
      en: "NetScan is developed for educational purposes and authorised network security assessments only. It must only be used on networks and systems you own or have explicit permission to scan. Unauthorised scanning may violate applicable laws and regulations. The developer assumes no responsibility for misuse of this tool or any damage resulting from its use."
    }
  }
);
