import jsPDF from 'jspdf';

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    portfolio?: string;
    profilePicture?: string;
  };
  summary?: string;
  experience: Array<{
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location: string;
    graduationDate: string;
    gpa?: string;
  }>;
  skills: string[];
  certifications?: any[];
  projects?: any[];
}

export async function generateResumePDF(resumeData: ResumeData): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Helper function to check if we need a new page
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Helper function to add text with word wrap
  const addText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10, style: 'normal' | 'bold' = 'normal') => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', style);
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, x, y);
    return lines.length * (fontSize * 0.35); // Return height used
  };

  // Add profile picture if available
  if (resumeData.personalInfo.profilePicture) {
    try {
      const imgSize = 30;
      pdf.addImage(resumeData.personalInfo.profilePicture, 'JPEG', margin, yPosition, imgSize, imgSize, '', 'FAST');
      
      // Add name and contact info next to photo
      const textX = margin + imgSize + 5;
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text(resumeData.personalInfo.fullName, textX, yPosition + 8);
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      const contactInfo = [
        resumeData.personalInfo.email,
        resumeData.personalInfo.phone,
        resumeData.personalInfo.location
      ].filter(Boolean).join(' • ');
      pdf.text(contactInfo, textX, yPosition + 14);
      
      if (resumeData.personalInfo.linkedin || resumeData.personalInfo.portfolio) {
        const links = [
          resumeData.personalInfo.linkedin,
          resumeData.personalInfo.portfolio
        ].filter(Boolean).join(' • ');
        pdf.setTextColor(0, 0, 255);
        pdf.text(links, textX, yPosition + 18);
        pdf.setTextColor(0, 0, 0);
      }
      
      yPosition += imgSize + 5;
    } catch (error) {
      console.error('Error adding profile picture:', error);
      // Continue without photo
    }
  } else {
    // Header without photo - centered
    pdf.setFontSize(22);
    pdf.setFont('helvetica', 'bold');
    pdf.text(resumeData.personalInfo.fullName, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const contactInfo = [
      resumeData.personalInfo.email,
      resumeData.personalInfo.phone,
      resumeData.personalInfo.location
    ].filter(Boolean).join(' • ');
    pdf.text(contactInfo, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 5;

    if (resumeData.personalInfo.linkedin || resumeData.personalInfo.portfolio) {
      const links = [
        resumeData.personalInfo.linkedin,
        resumeData.personalInfo.portfolio
      ].filter(Boolean).join(' • ');
      pdf.setTextColor(0, 0, 255);
      pdf.text(links, pageWidth / 2, yPosition, { align: 'center' });
      pdf.setTextColor(0, 0, 0);
      yPosition += 5;
    }
  }

  // Horizontal line
  pdf.setDrawColor(100, 100, 100);
  pdf.setLineWidth(0.5);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 8;

  // Professional Summary
  if (resumeData.summary) {
    checkPageBreak(20);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PROFESSIONAL SUMMARY', margin, yPosition);
    yPosition += 6;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const summaryLines = pdf.splitTextToSize(resumeData.summary, contentWidth);
    pdf.text(summaryLines, margin, yPosition);
    yPosition += summaryLines.length * 4.5 + 8;
  }

  // Skills
  if (resumeData.skills.length > 0) {
    checkPageBreak(20);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SKILLS', margin, yPosition);
    yPosition += 6;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    // Display skills in two columns
    const columnWidth = (contentWidth - 5) / 2;
    const leftColumnX = margin + 5;
    const rightColumnX = margin + columnWidth + 10;
    let leftColumnY = yPosition;
    let rightColumnY = yPosition;
    
    resumeData.skills.forEach((skill, index) => {
      checkPageBreak(10);
      
      if (index % 2 === 0) {
        // Left column
        pdf.text('•', leftColumnX - 3, leftColumnY);
        const skillLines = pdf.splitTextToSize(skill, columnWidth - 5);
        pdf.text(skillLines, leftColumnX, leftColumnY);
        leftColumnY += skillLines.length * 4.5 + 1;
      } else {
        // Right column
        pdf.text('•', rightColumnX - 3, rightColumnY);
        const skillLines = pdf.splitTextToSize(skill, columnWidth - 5);
        pdf.text(skillLines, rightColumnX, rightColumnY);
        rightColumnY += skillLines.length * 4.5 + 1;
      }
    });
    
    // Move yPosition to the bottom of the tallest column
    yPosition = Math.max(leftColumnY, rightColumnY) + 6;
  }

  // Experience
  if (resumeData.experience.length > 0 && resumeData.experience[0].title) {
    checkPageBreak(20);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PROFESSIONAL EXPERIENCE', margin, yPosition);
    yPosition += 6;

    resumeData.experience.forEach((exp, index) => {
      if (!exp.title) return;

      checkPageBreak(25);

      // Job title and company
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text(exp.title, margin, yPosition);
      
      pdf.setFont('helvetica', 'normal');
      pdf.text(exp.company, margin, yPosition + 5);

      // Location and dates (right aligned)
      pdf.setFontSize(9);
      const dateText = `${exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''} - ${exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}`;
      pdf.text(dateText, pageWidth - margin, yPosition, { align: 'right' });
      pdf.text(exp.location, pageWidth - margin, yPosition + 5, { align: 'right' });
      
      yPosition += 10;

      // Description
      if (exp.description) {
        pdf.setFontSize(10);
        const descLines = pdf.splitTextToSize(exp.description, contentWidth);
        pdf.text(descLines, margin, yPosition);
        yPosition += descLines.length * 4.5 + 2;
      }

      // Achievements
      if (exp.achievements.some(a => a.trim())) {
        exp.achievements.forEach(achievement => {
          if (!achievement.trim()) return;
          
          checkPageBreak(10);
          pdf.setFontSize(10);
          pdf.text('•', margin + 2, yPosition);
          const achLines = pdf.splitTextToSize(achievement, contentWidth - 5);
          pdf.text(achLines, margin + 7, yPosition);
          yPosition += achLines.length * 4.5 + 1;
        });
      }

      yPosition += 5;
    });
  }

  // Education
  if (resumeData.education.length > 0 && resumeData.education[0].degree) {
    checkPageBreak(20);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('EDUCATION', margin, yPosition);
    yPosition += 6;

    resumeData.education.forEach((edu, index) => {
      if (!edu.degree) return;

      checkPageBreak(15);

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text(edu.degree, margin, yPosition);

      pdf.setFont('helvetica', 'normal');
      pdf.text(edu.institution, margin, yPosition + 5);

      // Location and date (right aligned)
      pdf.setFontSize(9);
      if (edu.graduationDate) {
        const gradDate = new Date(edu.graduationDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        pdf.text(gradDate, pageWidth - margin, yPosition, { align: 'right' });
      }
      pdf.text(edu.location, pageWidth - margin, yPosition + 5, { align: 'right' });

      if (edu.gpa) {
        pdf.setFontSize(9);
        pdf.text(`GPA: ${edu.gpa}`, margin, yPosition + 10);
      }

      yPosition += 15;
    });
  }

  // Save the PDF
  const fileName = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`;
  pdf.save(fileName);
}

// Alternative: Generate and return as blob for preview
export async function generateResumePDFBlob(resumeData: ResumeData): Promise<Blob> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  // ... (same generation logic as above)
  return pdf.output('blob');
}
