One provider credential: whether it is set, and how to change it.

Hand-written from `apps/web/src/components/Settings/Common/ApiKeyRow.tsx`.

## What the consumer provides

The provider name, whether a key is stored, and the save handler.

## Rules

At rest it is an ordinary `SettingRow`: the provider name, an optional note about where the key lives, and on the right a state indicator plus an edit button. State is one dot and one word — `success` for saved, `warning` for not set. Not `danger`: a missing key is a configuration the person has not done yet.

Editing expands the row to `w-full` with the actions right-aligned at `mt-2 gap-1.5`. Letting the field take the row's full width rather than squeezing into the control column is the whole reason this is its own component.

The value is a mono `TextInput` and is **never echoed back**. The row reports that a key exists; it does not display it. Keys live in the OS keychain in packaged builds and behind `HUABU_SECRET_KEY` in development, and nothing in the UI should imply otherwise.

## Don't

Don't reveal a stored key, don't use `danger` for an unset provider, and don't auto-save on blur — a half-typed key that overwrites a working one is worse than an extra click.
