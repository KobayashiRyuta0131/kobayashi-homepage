import { fetchResumeData } from "@/lib/sheets";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const spreadsheetId =
      process.env.NEXT_PUBLIC_SPREADSHEET_ID ||
      "1OppbWzvUt7g5owjf8HZearJDm0wzNHlN";

    console.log("API: Fetching resume data for spreadsheet:", spreadsheetId);
    const resumeData = await fetchResumeData(spreadsheetId);
    
    return NextResponse.json(resumeData);
  } catch (error) {
    console.error("Error in resume API:", error);
    return NextResponse.json(
      { error: "Failed to fetch resume data" },
      { status: 500 }
    );
  }
}
