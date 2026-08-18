# Product Requirements Document (PRD) - Todo App Due Dates, Priorities, and Filters

## 1. Overview

We are upgrading the basic Todo app from title-and-completed tracking to a more useful task organization tool. The enhancement adds due dates, priority levels, and date-based filters so users can quickly identify urgent work while keeping the implementation simple and teachable.

---

## 2. MVP Scope

- Add an optional `dueDate` field to each task.
- Store due dates in ISO `YYYY-MM-DD` format.
- Treat invalid due date values as absent.
- Add a `priority` field to each task.
- Support exactly three priority values: `P1`, `P2`, and `P3`.
- Default new tasks to priority `P3` when no priority is provided.
- Keep `title` as a required field.
- Add task filters for `All`, `Today`, and `Overdue`.
- In the `All` view, show both incomplete and completed tasks.
- In the `Today` and `Overdue` views, show only incomplete tasks.
- Keep storage local with no backend or external storage changes.

---

## 3. Post-MVP Scope

- Visually highlight overdue tasks so they stand out, with red called out as the preferred treatment from the requirements meeting.
- Add visual priority badges for `P1`, `P2`, and `P3`.
- Use red for `P1`, orange for `P2`, and gray for `P3` priority badges.
- Add task sorting with the following precedence: overdue first, then priority from `P1` to `P3`, then due date ascending, with undated tasks last.

---

## 4. Out of Scope

- Notifications.
- Recurring tasks.
- Multi-user functionality.
- Keyboard navigation or special accessibility features.
- Backend changes.
- External storage.