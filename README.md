# JSON Viewer

A beautiful and interactive JSON viewer built with Next.js, similar to jsonblob.

## Features

- 🎨 **Syntax Highlighting**: Color-coded JSON values (strings, numbers, booleans, null, objects, arrays)
- 🔍 **Search Functionality**: Search through JSON keys and values
- 📂 **Expand/Collapse**: Expand and collapse objects and arrays
- 🎯 **Expand All / Collapse All**: Quick actions to expand or collapse everything
- 📋 **Format JSON**: Auto-format your JSON input
- 🎨 **Modern UI**: Clean and intuitive interface

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. Paste your JSON into the left input box
2. View the formatted, color-coded JSON in the right viewer
3. Click the arrows (▶/▼) to expand or collapse objects and arrays
4. Use the search box to filter JSON content
5. Use "Format" button to format your JSON input
6. Use "Expand All" / "Collapse All" buttons for quick navigation

## Color Scheme

- **Strings**: Green (#50a14f)
- **Numbers**: Orange (#986801)
- **Booleans**: Yellow (#c18401)
- **Null**: Purple (#a626a4)
- **Objects**: Red brackets (#e06c75)
- **Arrays**: Purple brackets (#c678dd)
- **Keys**: Blue (#4078f2)

## Build

```bash
npm run build
npm start
```

