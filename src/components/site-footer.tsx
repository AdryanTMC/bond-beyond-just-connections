import { useLang } from "@/i18n";

export function SiteFooter() {
  const { t } = useLang();
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-display text-2xl font-semibold">{t("brand.name")}</div>
          <p className="mt-3 text-sm text-muted-foreground max-w-sm">{t("footer.tagline")}</p>
        </div>
        <div>
          <div className="text-sm font-medium mb-3">{t("footer.product")}</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="/#features" className="hover:text-foreground">{t("footer.features")}</a></li>
            <li><a href="/#circles" className="hover:text-foreground">{t("footer.inner")}</a></li>
            <li><a href="/#pricing" className="hover:text-foreground">{t("footer.pricing")}</a></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-medium mb-3">{t("footer.languages")}</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>English</li>
            <li>Português (BR)</li>
            <li>Español</li>
            <li>Français</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {t("brand.name")}. {t("footer.copy")}
      </div>
    </footer>
  );
}
