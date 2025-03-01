# WSV-DWD-Warn

Diese Projekt soll die Wetterwarnungen, Pegelwerte von Stationen der Wasser- und Schiffahrtsverwaltung (WSV) sowie Messwerte von Stationen des Deutschen Wetterdienstes (DWD) darstellen. Dazu sind die Stationen georeferenziert in einem Leaflet Projekt dargestellt. Das Gebiet umfasst alle Stationen im Norden, also Schleswig-Holstein sowie Teilen von Niedersachsen und Mecklenburg-Vorpommern. Die Darstellung und Auswahl der Messwerte ist optimiert für die Verwendung der App hauptsächlich durch Hilfsorganisationen im Katastrophenschutz.

Die Karte zeigt zunächst alle Wetterwarnungen bezogen auf die Landkreise und Küstengebiete. Weiterhin sind alle Pegel des WSV an Nordsee und Ostsee mit ihrer Warnfarbe zu sehen. Nach Auswahl von Stationen und/oder Warngebieten werden auf einer zweiten Seite die Details dargestellt. Der Inhalt wird automatisch alle 20 Minuten aktualisiert.

Die Software wurde als OpenSource Projekt vom Autor 'Laterne2024' erstellt auf dem gitHub Portal veröffentlicht. Es wird teilweise Code von anderen Entwicklern genutzt, speziell aus dem DWD-Wetterwarnmodul-2 vom Autor 'dj0001'. Die Daten vom WSV und DWD sind zur freien Verwendung veröffentlicht, siehe dazu den Link zu den Lizenzbedingungen in der Fusszeile. Es werden für die Datenabfrage die entsprechenden APIs der Anbieter verwendet (REST-API des WSV und geoserver-Dienste des DWD).
</br>Stand: 18.2.2025
