// Wix served posts at /post/<slug>; keep those URLs working after the move.
export { default, generateMetadata } from "../../blog/[slug]/page";
export const dynamic = "force-dynamic";
