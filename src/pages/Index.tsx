import { Link } from "react-router-dom";
import { FileText, Award } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full text-center animate-slide-up">
          <div className="mb-3">
            <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 rounded-full">
              A Perfect Place for Science
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-3 leading-tight">
            Study
            <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded-lg ml-1">
              ROOM
            </span>
          </h1>
          <p className="text-muted-foreground text-lg mb-12 max-w-md mx-auto">
            Generate professional Admit Cards and Result slips from Excel data in seconds.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto">
            <Link to="/admit-card" className="group">
              <div className="bg-card border-2 border-border rounded-2xl p-8 hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-primary transition-colors duration-300">
                  <FileText className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Admit Card Generator
                </h2>
                <p className="text-muted-foreground text-sm">
                  Upload student data and generate printable admit cards
                </p>
              </div>
            </Link>

            <Link to="/result" className="group">
              <div className="bg-card border-2 border-border rounded-2xl p-8 hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-primary transition-colors duration-300">
                  <Award className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Result Generator
                </h2>
                <p className="text-muted-foreground text-sm">
                  Create and download examination result slips
                </p>
              </div>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
