import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage("");

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setFormData({ name: "", email: "", subject: "", message: "" });
            } else {
                setStatus('error');
                setErrorMessage(data.error || "Failed to send message.");
            }
        } catch (error) {
            console.error("Submission error:", error);
            setStatus('error');
            setErrorMessage("An unexpected error occurred. Please try again.");
        }
    };

    if (status === 'success') {
        return (
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 md:p-10 shadow-sm border border-neutral-100 dark:border-neutral-800 flex flex-col items-center justify-center text-center min-h-[500px]">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-6"
                >
                    <CheckCircle2 className="w-10 h-10" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                <p className="text-muted-foreground mb-8">
                    Thank you for reaching out. We&apos;ve received your message and will get back to you within 24 hours.
                </p>
                <button
                    onClick={() => setStatus('idle')}
                    className="px-8 py-3 bg-black text-white dark:bg-white dark:text-black rounded-xl font-bold hover:scale-105 transition-all"
                >
                    Send Another Message
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 md:p-10 shadow-sm border border-neutral-100 dark:border-neutral-800">
            <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Send us a Message</h3>
                <p className="text-muted-foreground">We usually reply within 24 hours.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="w-full px-4 py-3 rounded-lg bg-neutral-50 border border-neutral-200 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all dark:bg-neutral-800 dark:border-neutral-700 font-medium"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            className="w-full px-4 py-3 rounded-lg bg-neutral-50 border border-neutral-200 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all dark:bg-neutral-800 dark:border-neutral-700 font-medium"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                        Subject
                    </label>
                    <input
                        type="text"
                        id="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help?"
                        className="w-full px-4 py-3 rounded-lg bg-neutral-50 border border-neutral-200 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all dark:bg-neutral-800 dark:border-neutral-700 font-medium"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                        Message
                    </label>
                    <textarea
                        id="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Tell us more about your inquiry..."
                        className="w-full px-4 py-3 rounded-lg bg-neutral-50 border border-neutral-200 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all resize-none dark:bg-neutral-800 dark:border-neutral-700 font-medium"
                    />
                </div>

                <AnimatePresence>
                    {status === 'error' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-center gap-2 p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl text-sm font-medium"
                        >
                            <AlertCircle className="w-4 h-4" />
                            {errorMessage}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={status === 'loading'}
                    className="w-full bg-black text-white hover:bg-neutral-800 py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors dark:bg-white dark:text-black dark:hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {status === 'loading' ? (
                        <>Sending... <Loader2 className="w-4 h-4 animate-spin" /></>
                    ) : (
                        <>Send Message <Send className="w-4 h-4" /></>
                    )}
                </motion.button>
            </form>
        </div>
    );
}
