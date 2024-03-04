import React, { useEffect } from 'react';
import './TooltipInitializer.css'

function TooltipInitializer() {
  useEffect(() => {
    // Enable tooltips after Bootstrap script has been loaded
    if (typeof window !== 'undefined' && typeof window.bootstrap !== 'undefined') {
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.map((tooltipTriggerEl) => {
        const tooltip = new window.bootstrap.Tooltip(tooltipTriggerEl);

        // Show tooltip on hover
        tooltipTriggerEl.addEventListener('mouseover', () => {
          tooltip.show();
        });

        // Hide tooltip when mouse leaves
        tooltipTriggerEl.addEventListener('mouseleave', () => {
          tooltip.hide();
        });

        return tooltip;
      });
    }
  }, []); // Run this effect only once after the component mounts and after Bootstrap script has been loaded

  return null; // TooltipInitializer doesn't render anything visible
  
}

export default TooltipInitializer;
