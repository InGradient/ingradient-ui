# Catalog boundary

`CatalogView` is the package-root entry point. Its controlled prop types, public data rows (`CatalogDataset`, `CatalogImage`, `CatalogClass`), and the small state types needed to construct those props are public. Dataset/gallery/dialog/sidebar implementation components remain internal to `@ingradient/platform-pages`.

See the [package contract](../../README.md) for the repository/application ownership boundary.

## Responsive contract

- Desktop: `isMobile` is absent or `false`; `rightSidebar` is available and `statsContent` is supported.
- Mobile: `isMobile: true` and `mobile` are required; `rightSidebar` and `statsContent` are excluded.
- Mobile view mode is explicitly limited to `grid | table`. A responsive adapter must normalize desktop-only `stats` state before constructing mobile props.

These combinations are encoded by `CatalogDesktopViewProps | CatalogMobileViewProps`, rather than runtime fallback behavior.

## Internal cross-domain dependency

`GalleryDetailModal` is used by both Catalog and ClassManage. It remains an internal relative import and is intentionally not re-exported from the package root until a dedicated shared platform-owned media boundary is introduced.
