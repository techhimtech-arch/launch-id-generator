import { Link } from "react-router-dom";
import { Phone, Mail } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-sm">
        <div>
          <div className="font-semibold text-foreground">ID Card Studio</div>
          <p className="mt-2 text-muted-foreground">
            Bulk ID card maker for photographers, print shops, schools and offices. Made in India.
          </p>
        </div>
        <div>
          <div className="font-semibold text-foreground mb-3">Product</div>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/app" className="hover:text-foreground">Open app</Link></li>
            <li><Link to="/templates" className="hover:text-foreground">Templates</Link></li>
            <li><Link to="/pricing" className="hover:text-foreground">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-foreground mb-3">Company</div>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/contact" className="hover:text-foreground">Contact us</Link></li>
            <li><Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-foreground">Terms of Service</Link></li>
            <li><Link to="/refund" className="hover:text-foreground">Refund Policy</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-foreground mb-3">Support</div>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <a href="tel:+918618982400" className="hover:text-foreground">+91 86189 82400</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <a href="mailto:support@idcardstudio.app" className="hover:text-foreground">support@idcardstudio.app</a>
            </li>
            <li className="text-xs text-muted-foreground/80 pt-1">Mon–Sat, 10 AM – 7 PM IST</li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} ID Card Studio. All rights reserved.</div>
          <div>Crafted with care for Indian businesses.</div>
        </div>
      </div>
    </footer>
  );
}
