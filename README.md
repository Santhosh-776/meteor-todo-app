# Meteor Blaze Simple Todos Application

A modern, responsive, and interactive Todo List application built using **Meteor.js v3** and **Blaze** templates. This application was completed as an internship assessment and showcases key full-stack development concepts, reactive UI binding, and drag-and-drop interactivity.

## Features

- **Blaze Templates**: Uses Blaze (`.html` and `.js`) for a light, responsive reactive UI.
- **MongoDB Collection**: Backed by a MongoDB collection for persistent real-time updates.
- **Meteor 3 async/await**: Leverages the modern Meteor 3 asynchronous Mongo API (`insertAsync`, `updateAsync`, `removeAsync`, `countAsync`, and `fetchAsync`).
- **Task Categories**: Each task is classified into one of the following categories:
  - Work
  - Personal
  - Urgent
  - Others
- **Category Badges**: Distinct visual badge coloring per category.
- **Reactive Category Filter**: Smoothly filter tasks by category using Meteor's `ReactiveVar`.
- **Drag-and-Drop Reordering**: Drag tasks to rearrange their order using `sortablejs`. Reordering updates persistent positions in the MongoDB database, and works flawlessly even when a category filter is active.
- **Premium Styling**: Features a stunning, dark-mode design with glowing radial gradients, glassmorphism, responsive grid layout, micro-interactions, smooth hover transitions, and grabbing cursors for dragging.

---

## Folder Structure

Following the recommended clean organization:

```text
imports/
├── api/
│   └── tasksCollection.js   # MongoDB Collection definition
└── ui/
    ├── App.html             # App root template
    ├── App.js               # App logic, filtering, creation and reordering handlers
    ├── Task.html            # Individual task item template
    ├── Task.js              # Task interaction event handlers
    └── styles.css           # Premium styling & dark-theme variables
client/
├── main.html                # Entry HTML file
└── main.js                  # Entry JS file (imports App)
server/
└── main.js                  # Server entry point and database seeding
```

---

## Setup & Running

### Prerequisites

Ensure you have **Node.js v20+** installed, as well as the **Meteor CLI**:

```bash
# Verify Node and npm are installed
node -v
npm -v

# Install Meteor CLI globally (macOS / Linux)
curl https://install.meteor.com/ | sh
```

### Installation

1. Clone the repository and navigate to the project root:
   ```bash
   git clone git@github.com:Santhosh-776/meteor-todo-app.git
   cd meteor-todo-app
   ```

2. Switch to the `develop` branch (where development was completed):
   ```bash
   git checkout develop
   ```

3. Install the dependencies (including SortableJS):
   ```bash
   meteor npm install
   ```

### Run the Application

Start the local development server:

```bash
meteor run
```

The application will launch and be available at: [http://localhost:3000](http://localhost:3000)

---

## Technical Details

### Drag and Drop Reordering with Filtering
To support drag-and-drop reordering when filters are active, the application:
1. Detects the moved item ID and its immediate sibling's ID from the updated DOM nodes.
2. Fetches the full sorted tasks list from the collection.
3. Repositions the moved task in the full array relative to the visible neighbor nodes.
4. Serializes the updated positions back to MongoDB in a clean, zero-indexed sequence.

This prevents hidden items from shifting and maintains exact, consistent reordering across multiple filters.