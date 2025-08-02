import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function About(){
    return(
        <>
            <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          }
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
            <SiteHeader />
            <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="px-4 lg:px-6">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold mb-2">About This Project</h1>
                        <p className="text-muted-foreground">
                            Learn more about our mission and team.
                        </p>
                    </div>
                    
                    <div className="max-w-4xl space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-3">Hi, I&apos;m Abraham Bill Clinton.</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                This cryptocurrency dashboard was built using Next.js as part of my journey into modern web development. 
                                The goal of this project was not only to create a functional application but also to strengthen my 
                                understanding of real-world development practices.
                            </p>
                        </div>

                        <div>
                            <p className="text-muted-foreground leading-relaxed">
                                Throughout the development process, I actively used AI tools like Cursor and ChatGPT as learning companions. 
                                They helped me clarify concepts, debug issues, and accelerate development. However, every decision, 
                                integration, and line of code was a part of my own learning process and hands-on implementation.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2">Technology Stack</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                This application uses the CoinGecko API to fetch and display real-time cryptocurrency data, including market information, 
                                coin-specific details, and charts. The UI is built with Tailwind CSS and enhanced using Shadcn UI, which provided a 
                                consistent and accessible design system. Most of the interface, including components like cards, buttons, layout containers, 
                                and modals, was built with Shadcn.
                            </p>
                        </div>

                        <div>
                            <p className="text-muted-foreground leading-relaxed">
                                Additionally, I integrated Firebase Authentication to allow users to sign in with Google and view basic profile 
                                information like name and email.
                            </p>
                        </div>

                        <div>
                            <p className="text-muted-foreground leading-relaxed">
                                This project reflects my ongoing growth as a developer, and I&apos;m continuously working to improve it 
                                as I explore more of the full stack ecosystem.
                            </p>
                        </div>

                        <div className="pt-4">
                            <p className="text-lg font-medium">Thank you for visiting.</p>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            </div>
        </SidebarInset>
        </SidebarProvider>
        </>
    )
}