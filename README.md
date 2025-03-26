# Chatbot für Lernfeld 6

Dieses Projekt ist ein Chatbot für Lernfeld 6, der eine interaktive Möglichkeit bietet, Inhalte zu diesem Themenbereich zu erarbeiten. Das System besteht aus einem modernen Tech-Stack mit einem Spring Boot-Backend und einem React-Frontend, um eine schnelle und zuverlässige Webschnittstelle bereitzustellen.

## Projektstruktur

Das Projekt besteht aus zwei Hauptkomponenten:

1. **Backend (Spring Boot)**: Bereitstellung der REST API und Datenverwaltung.
2. **Frontend (React + TypeScript)**: Benutzeroberfläche zur Interaktion mit dem Chatbot.

## Technologien

### Backend
Das Backend basiert auf **Spring Boot** und bietet eine robuste REST API zur Verarbeitung von Benutzeranfragen. Die wichtigsten verwendeten Technologien sind:

- **Spring Boot** – Hauptframework für das Backend.
- **Spring Web** – Erstellung der REST API.
- **Spring Data JPA** – Datenpersistenz und ORM (Object-Relational Mapping).
- **H2 oder PostgreSQL** – Datenbank für die Speicherung von Daten.
- **Flyway** – Verwaltung und Durchführung von Datenbankmigrationen.

### Frontend
Das Frontend ist mit **React und TypeScript** entwickelt und wird mit **Vite** optimiert und gebündelt. Zum Einsatz kommen unter anderem folgende Technologien:

- **React** – UI-Framework für die Erstellung der Benutzeroberfläche.
- **React Router** – Navigation innerhalb der Anwendung.
- **React Query** – Optimiertes Datenmanagement und API-Abfragen.
- **Vite** – Schnelles Build-Tool für das Bündeln der Anwendung.

## Einrichtung und Installation

### Backend
1. Klone das Repository
2. Starte die Anwendung mit Maven:
   ```sh
   mvn spring-boot:run
   ```
3. Die API ist nun unter `http://localhost:8080/api/` erreichbar.

### Frontend
1. Wechsel in das Frontend-Verzeichnis:
   ```sh
   cd web
   ```
2. Installiere die Abhängigkeiten:
   ```sh
   npm install
   ```
3. Starte die Entwicklungsumgebung:
   ```sh
   npm start
   ```
4. Die Anwendung läuft jetzt unter `http://localhost:5173`. Damit das Frontend auf die API zugreifen kann, muss parallel das Backend unter Port 8080 laufen. Anfragen werden dann von vite per Proxy dahin weitergeleitet.