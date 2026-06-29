# Handoff Phase 4, Storage and Data-Loss Hardening

## Goal

Reduce data-loss risk across IndexedDB, LocalStorage, folder mode, import/export, and remote system data updates.

## Scope

Included:

- Folder mode overwrite prevention.
- Import validation.
- Export/import summaries.
- Remote data update safety.
- Storage documentation.
- Backup recovery notes.

Excluded:

- Docker.
- Tauri implementation.
- New cloud sync system.
- Full rewrite of storage architecture unless required for safety.

## Current Risk

The upstream project historically had File System mode data-loss reports. Treat folder storage as a high-risk area. Do not silently overwrite user files.

## Instructions

### 1. Create phase branch

```bash
git checkout byok-alpha
git checkout -b phase-4-storage-hardening
```

### 2. Preserve IndexedDB as main browser storage

Keep IndexedDB for large app data. Do not move templates/banks back to LocalStorage.

### 3. Review folder mode write flow

Keep or enforce this safe write sequence:

```text
Build payload.
Serialize JSON.
Validate serialized JSON.
Write temp file.
Read temp file back.
Validate temp file.
Backup existing main file.
Write main file.
Delete temp file.
Clean old extra backups if applicable.
```

### 4. Prevent folder overwrite races

Folder mode must not auto-save until one of these is true:

```text
Existing folder data has been loaded successfully.
User explicitly chose to start fresh.
User explicitly confirmed overwrite.
```

### 5. Add folder mode choice dialog

When selecting a folder, if `prompt_fill_data.json` exists, show:

```text
Existing PromptFill data found in this folder.

Choose one:
- Load existing folder data
- Start fresh and overwrite folder data
- Cancel
```

If no file exists, show:

```text
No PromptFill data file was found. Start fresh in this folder?
```

### 6. Backup recovery UI or documentation

At minimum, document that folder mode uses:

```text
prompt_fill_data.json
prompt_fill_data.bak.json
```

If feasible, add a restore-from-backup action.

### 7. Validate imports before applying

Before importing JSON:

```text
Parse safely.
Validate expected shape.
Show summary of templates, banks, categories, defaults.
Ask user to confirm.
Offer merge or replace where practical.
Never import API keys or local-only settings.
```

### 8. Remote/system data updates

Do not silently replace user templates or banks with remote system data.

Any update should:

```text
Merge official templates only.
Preserve user templates.
Preserve user banks unless user confirms.
Show summary before applying.
Allow cancel.
```

Add or respect feature flag:

```js
REMOTE_SYSTEM_DATA_ENABLED
```

For personal fork, consider disabling remote system data by default unless needed.

### 9. Storage documentation

README should explain:

```text
Browser storage mode.
Folder storage mode.
What files folder mode creates.
How backups work.
How import/export works.
How to avoid overwriting data.
How to recover from backup.
```

## Checklist

- [ ] IndexedDB remains the main browser storage for large data.
- [ ] Folder write flow validates before writing main file.
- [ ] Folder write flow creates/updates backup before overwriting main file.
- [ ] Folder mode cannot auto-save before hydration or explicit user confirmation.
- [ ] Folder selection detects existing `prompt_fill_data.json`.
- [ ] Existing folder data flow offers load, overwrite, or cancel.
- [ ] No existing folder data flow asks before starting fresh.
- [ ] Backup file behavior is documented.
- [ ] Restore-from-backup exists or is documented clearly.
- [ ] Import validates shape before applying.
- [ ] Import shows summary before applying.
- [ ] Import does not import AI keys or local-only settings.
- [ ] Remote/system data updates do not silently overwrite user data.
- [ ] Remote/system data update flow can be disabled.
- [ ] README storage section updated.
- [ ] No Docker work added.
- [ ] No Tauri implementation work added.
- [ ] Build passes.
- [ ] Lint passes.

## Stop Point

Stop when storage paths are safer, imports are validated, and no user data is overwritten without explicit consent.
