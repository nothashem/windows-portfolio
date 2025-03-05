'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { WindowFrame } from './window/WindowFrame'
import { FaTable } from 'react-icons/fa'
import React from 'react'

interface CellData {
  value: string
  isEditing: boolean
  formula?: string // Store the original formula
  computedValue?: string // Store the computed result
}

interface Sheet {
  id: string
  name: string
  cells: Record<string, CellData>
}

interface ExcelState {
  activeSheetId: string
  sheets: Record<string, Sheet>
}

interface ExcelProps {
  isOpen: boolean
  onClose: () => void
  onMinimize?: () => void
}

const COLS = 26 // A-Z
const ROWS = 100

// Update the CELL_DIMENSIONS constant to include padding
const CELL_DIMENSIONS = {
  width: 120,
  height: 32,
  headerHeight: 32,
  rowHeaderWidth: 50,
  padding: {
    x: 8,  // Horizontal padding
    y: 4   // Vertical padding
  }
};

// Add this interface for the error boundary props
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

// Update the class definition to include the props interface
class ExcelErrorBoundary extends React.Component<ErrorBoundaryProps> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Excel component error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-red-500">
          An error occurred in the Excel component. Please refresh the page.
        </div>
      );
    }

    return this.props.children;
  }
}

// Add a function to handle local storage
const saveToLocalStorage = (state: ExcelState) => {
  try {
    localStorage.setItem('excelState', JSON.stringify(state));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Remove unused functions or mark them for future use
// If you plan to use these functions later, keep them with the comment:
/* eslint-disable @typescript-eslint/no-unused-vars */
const clearSavedData = () => {
  localStorage.removeItem('excelState');
  window.location.reload();
};

export const Excel = ({ isOpen, onClose, onMinimize }: ExcelProps) => {
  // Modify the initial state to check localStorage first
  const [excelState, setExcelState] = useState<ExcelState>(() => {
    try {
      const saved = localStorage.getItem('excelState');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    
    // Return default state if no saved state exists
    return {
      activeSheetId: 'sheet1',
      sheets: {
        sheet1: {
          id: 'sheet1',
          name: 'Business Valuation',
          cells: {
            // Title
            'B1': { value: 'Company Valuation Model', isEditing: false },
            'B2': { value: 'All values in millions USD', isEditing: false },
            
            // Historical Financial Data
            'B4': { value: 'Historical Financials', isEditing: false },
            'B5': { value: 'Year', isEditing: false },
            'C5': { value: '2021', isEditing: false },
            'D5': { value: '2022', isEditing: false },
            'E5': { value: '2023', isEditing: false },
            
            'B6': { value: 'Revenue', isEditing: false },
            'C6': { value: '100', isEditing: false },
            'D6': { value: '120', isEditing: false },
            'E6': { value: '150', isEditing: false },
            
            'B7': { value: 'EBITDA', isEditing: false },
            'C7': { value: '20', isEditing: false },
            'D7': { value: '25', isEditing: false },
            'E7': { value: '35', isEditing: false },
            
            'B8': { value: 'EBITDA Margin', isEditing: false },
            'C8': { value: '=C7/C6*100', isEditing: false, formula: '=C7/C6*100' },
            'D8': { value: '=D7/D6*100', isEditing: false, formula: '=D7/D6*100' },
            'E8': { value: '=E7/E6*100', isEditing: false, formula: '=E7/E6*100' },
            
            // Growth Rates
            'B10': { value: 'Growth Analysis', isEditing: false },
            'B11': { value: 'Revenue Growth', isEditing: false },
            'D11': { value: '=(D6/C6-1)*100', isEditing: false, formula: '=(D6/C6-1)*100' },
            'E11': { value: '=(E6/D6-1)*100', isEditing: false, formula: '=(E6/D6-1)*100' },
            
            'B12': { value: 'EBITDA Growth', isEditing: false },
            'D12': { value: '=(D7/C7-1)*100', isEditing: false, formula: '=(D7/C7-1)*100' },
            'E12': { value: '=(E7/D7-1)*100', isEditing: false, formula: '=(E7/D7-1)*100' },
            
            // DCF Assumptions
            'B14': { value: 'DCF Assumptions', isEditing: false },
            'B15': { value: 'Projected Growth Rate', isEditing: false },
            'C15': { value: '10', isEditing: false },
            
            'B16': { value: 'WACC', isEditing: false },
            'C16': { value: '12', isEditing: false },
            
            'B17': { value: 'Terminal Growth Rate', isEditing: false },
            'C17': { value: '2', isEditing: false },
            
            // Projected Financials
            'B19': { value: 'Projected Financials', isEditing: false },
            'B20': { value: 'Year', isEditing: false },
            'C20': { value: '2024E', isEditing: false },
            'D20': { value: '2025E', isEditing: false },
            'E20': { value: '2026E', isEditing: false },
            
            'B21': { value: 'Revenue', isEditing: false },
            'C21': { value: '=E6*(1+C15/100)', isEditing: false, formula: '=E6*(1+C15/100)' },
            'D21': { value: '=C21*(1+C15/100)', isEditing: false, formula: '=C21*(1+C15/100)' },
            'E21': { value: '=D21*(1+C15/100)', isEditing: false, formula: '=D21*(1+C15/100)' },
            
            'B22': { value: 'EBITDA', isEditing: false },
            'C22': { value: '=C21*E8/100', isEditing: false, formula: '=C21*E8/100' },
            'D22': { value: '=D21*E8/100', isEditing: false, formula: '=D21*E8/100' },
            'E22': { value: '=E21*E8/100', isEditing: false, formula: '=E21*E8/100' },
            
            // DCF Calculation
            'B24': { value: 'DCF Valuation', isEditing: false },
            'B25': { value: 'Free Cash Flow', isEditing: false },
            'C25': { value: '=C22*0.7', isEditing: false, formula: '=C22*0.7' },
            'D25': { value: '=D22*0.7', isEditing: false, formula: '=D22*0.7' },
            'E25': { value: '=E22*0.7', isEditing: false, formula: '=E22*0.7' },
            
            'B26': { value: 'Discount Factor', isEditing: false },
            'C26': { value: '=1/(1+C16/100)^1', isEditing: false, formula: '=1/(1+C16/100)^1' },
            'D26': { value: '=1/(1+C16/100)^2', isEditing: false, formula: '=1/(1+C16/100)^2' },
            'E26': { value: '=1/(1+C16/100)^3', isEditing: false, formula: '=1/(1+C16/100)^3' },
            
            'B27': { value: 'PV of FCF', isEditing: false },
            'C27': { value: '=C25*C26', isEditing: false, formula: '=C25*C26' },
            'D27': { value: '=D25*D26', isEditing: false, formula: '=D25*D26' },
            'E27': { value: '=E25*E26', isEditing: false, formula: '=E25*E26' },
            
            // Terminal Value
            'B29': { value: 'Terminal Value', isEditing: false },
            'E29': { value: '=E25*(1+C17/100)/(C16/100-C17/100)', isEditing: false, formula: '=E25*(1+C17/100)/(C16/100-C17/100)' },
            
            'B30': { value: 'PV of Terminal Value', isEditing: false },
            'E30': { value: '=E29*E26', isEditing: false, formula: '=E29*E26' },
            
            // Enterprise Value
            'B32': { value: 'Enterprise Value', isEditing: false },
            'C32': { value: '=SUM(C27:E27)+E30', isEditing: false, formula: '=C27+D27+E27+E30' },
            
            // Trading Multiples
            'G4': { value: 'Trading Multiples', isEditing: false },
            'G5': { value: 'EV/EBITDA Multiple', isEditing: false },
            'H5': { value: '=C32/E7', isEditing: false, formula: '=C32/E7' },
            
            'G6': { value: 'EV/Revenue Multiple', isEditing: false },
            'H6': { value: '=C32/E6', isEditing: false, formula: '=C32/E6' }
          }
        }
      }
    };
  });

  // Add useEffect to save state changes to localStorage
  useEffect(() => {
    saveToLocalStorage(excelState);
  }, [excelState]);

  // Add this useEffect after state initialization
  useEffect(() => {
    const savedState = localStorage.getItem('excelState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setExcelState(parsed);
      } catch (error) {
        console.error('Error parsing saved excel state:', error);
      }
    }
  }, []);

  const [selectedCell, setSelectedCell] = useState<{sheetId: string, cellId: string} | null>(null)
  const editInputRef = useRef<HTMLInputElement>(null)

  // Cache for formula evaluation results
  const formulaCache = useRef<Record<string, string>>({});

  // Add this state to track if formulas have been initialized
  const [formulasInitialized, setFormulasInitialized] = useState(false);

  const [isMaximized, setIsMaximized] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  const getCellId = (row: number, col: number) => `${String.fromCharCode(65 + col)}${row + 1}`
  const getColHeader = (col: number) => String.fromCharCode(65 + col)

  // Memoize getCurrentSheet function
  const getCurrentSheet = useCallback(() => {
    return excelState.sheets[excelState.activeSheetId];
  }, [excelState.sheets, excelState.activeSheetId]);

  // Memoize evaluateFormula function
  const evaluateFormula = useCallback((formula: string, cellId: string): string => {
    try {
      if (!formula?.startsWith('=')) return formula;
      
      // Check cache first
      const cacheKey = `${cellId}:${formula}`;
      if (formulaCache.current[cacheKey]) {
        return formulaCache.current[cacheKey];
      }

      const expression = formula.substring(1).trim();
      
      // Handle SUM function
      if (expression.startsWith('SUM(')) {
        const range = expression.match(/SUM\((.*?)\)/)?.[1];
        if (range) {
          const [start, end] = range.split(':');
          if (start && end) {
            const startCol = start.charAt(0);
            const endCol = end.charAt(0);
            const startRow = parseInt(start.slice(1));
            const endRow = parseInt(end.slice(1));
            
            let sum = 0;
            for(let col = startCol.charCodeAt(0); col <= endCol.charCodeAt(0); col++) {
              for(let row = startRow; row <= endRow; row++) {
                const cellId = `${String.fromCharCode(col)}${row}`;
                const value = getCurrentSheet().cells[cellId]?.value || '0';
                const numValue = parseFloat(value);
                if (!isNaN(numValue)) {
                  sum += numValue;
                }
              }
            }
            return sum.toFixed(2);
          }
        }
        return '#ERROR!';
      }
      
      // Replace cell references with their values
      const evaluatedExpression = expression.replace(/[A-Z]+[0-9]+/g, (match) => {
        if (match === cellId) return '0'; // Prevent self-reference
        const cell = getCurrentSheet().cells[match];
        const value = cell?.computedValue || cell?.value || '0';
        return value;
      });

      // Safe arithmetic evaluation
      const tokens = evaluatedExpression
        .replace(/[^0-9+\-*/.()\s]/g, '')
        .match(/\d+\.?\d*|[+\-*/()]/g) || [];
      
      const calculateExpression = (tokens: string[]): number => {
        const precedence: { [key: string]: number } = {
          '+': 1,
          '-': 1,
          '*': 2,
          '/': 2,
        };

        const output: string[] = [];
        const operators: string[] = [];

        for (const token of tokens) {
          if (!isNaN(Number(token))) {
            output.push(token);
          } else if (token === '(') {
            operators.push(token);
          } else if (token === ')') {
            while (operators.length && operators[operators.length - 1] !== '(') {
              output.push(operators.pop()!);
            }
            operators.pop(); // Remove '('
          } else {
            while (
              operators.length &&
              operators[operators.length - 1] !== '(' &&
              precedence[operators[operators.length - 1]] >= precedence[token]
            ) {
              output.push(operators.pop()!);
            }
            operators.push(token);
          }
        }

        while (operators.length) {
          output.push(operators.pop()!);
        }

        const stack: number[] = [];
        
        for (const token of output) {
          if (!isNaN(Number(token))) {
            stack.push(Number(token));
          } else {
            const b = stack.pop() || 0;
            const a = stack.pop() || 0;
            switch (token) {
              case '+': stack.push(a + b); break;
              case '-': stack.push(a - b); break;
              case '*': stack.push(a * b); break;
              case '/': stack.push(b === 0 ? NaN : a / b); break;
            }
          }
        }

        return stack[0] || 0;
      };

      const result = calculateExpression(tokens);
      
      if (!isFinite(result) || isNaN(result)) {
        return '#ERROR!';
      }
      
      const formattedResult = result.toFixed(2);
      formulaCache.current[cacheKey] = formattedResult;
      return formattedResult;
    } catch (error) {
      console.error('Formula evaluation error:', error);
      return '#ERROR!';
    }
  }, [getCurrentSheet]);

  const addNewSheet = () => {
    const sheetCount = Object.keys(excelState.sheets).length + 1
    const newSheetId = `sheet${sheetCount}`
    
    setExcelState(prev => ({
      ...prev,
      activeSheetId: newSheetId,
      sheets: {
        ...prev.sheets,
        [newSheetId]: {
          id: newSheetId,
          name: `Sheet ${sheetCount}`,
          cells: {}
        }
      }
    }))
  }

  const switchSheet = (sheetId: string) => {
    setExcelState(prev => ({
      ...prev,
      activeSheetId: sheetId
    }))
    setSelectedCell(null)
  }

  const deleteSheet = (sheetId: string) => {
    if (Object.keys(excelState.sheets).length <= 1) return
    
    setExcelState(prev => {
      const { ...remainingSheets } = prev.sheets
      delete remainingSheets[sheetId]
      const newActiveId = prev.activeSheetId === sheetId 
        ? Object.keys(remainingSheets)[0] 
        : prev.activeSheetId
      
      return {
        activeSheetId: newActiveId,
        sheets: remainingSheets
      }
    })
  }

  const handleCellSelect = useCallback((cellId: string, startEditing: boolean = false) => {
    setSelectedCell({
      sheetId: excelState.activeSheetId,
      cellId
    });

    if (startEditing) {
      setExcelState(prev => ({
        ...prev,
        sheets: {
          ...prev.sheets,
          [prev.activeSheetId]: {
            ...prev.sheets[prev.activeSheetId],
            cells: {
              ...prev.sheets[prev.activeSheetId].cells,
              [cellId]: {
                ...prev.sheets[prev.activeSheetId].cells[cellId],
                isEditing: true
              }
            }
          }
        }
      }));
    }
  }, [excelState.activeSheetId]);

  const handleCellClick = (cellId: string) => {
    const currentSheet = getCurrentSheet();
    const currentCell = currentSheet.cells[cellId];
    const isAlreadySelected = selectedCell?.cellId === cellId;

    // If cell is already selected and clicked again, start editing
    if (isAlreadySelected) {
      setExcelState(prev => ({
        ...prev,
        sheets: {
          ...prev.sheets,
          [prev.activeSheetId]: {
            ...prev.sheets[prev.activeSheetId],
            cells: {
              ...prev.sheets[prev.activeSheetId].cells,
              [cellId]: {
                ...currentCell,
                isEditing: true,
                value: currentCell?.formula || currentCell?.value || ''
              }
            }
          }
        }
      }));
    } else {
      // Just select the cell on first click
      setSelectedCell({ sheetId: excelState.activeSheetId, cellId });
      
      // If any other cell is being edited, finish its editing
      if (selectedCell) {
        finishEditing(selectedCell.cellId);
      }
    }
  };

  const handleCellBlur = (cellId: string) => {
    setTimeout(() => {
      if (selectedCell && selectedCell.cellId === cellId) {
        finishEditing(cellId);
      }
    }, 0);
  }

  // Update batchUpdateCells to use useCallback
  const batchUpdateCells = useCallback((updates: Record<string, Partial<CellData>>) => {
    setExcelState(prev => {
      const currentSheet = prev.sheets[prev.activeSheetId];
      const updatedCells: Record<string, CellData> = {};

      // Ensure each update maintains the complete CellData structure
      Object.entries(updates).forEach(([cellId, update]) => {
        const currentCell = currentSheet.cells[cellId] || {
          value: '',
          isEditing: false
        };
        
        updatedCells[cellId] = {
          ...currentCell,
          ...update,
          // Ensure required properties are never undefined
          value: update.value ?? currentCell.value ?? '',
          isEditing: update.isEditing ?? currentCell.isEditing ?? false
        };
      });

      return {
        ...prev,
        sheets: {
          ...prev.sheets,
          [prev.activeSheetId]: {
            ...currentSheet,
            cells: {
              ...currentSheet.cells,
              ...updatedCells
            }
          }
        }
      };
    });
  }, []);

  // Move finishEditing up and memoize it
  const finishEditing = useCallback((cellId: string) => {
    const currentSheet = getCurrentSheet()
    const cell = currentSheet.cells[cellId];
    if (!cell) return;

    const isFormula = cell.value?.startsWith('=');
    const updates: Record<string, Partial<CellData>> = {};

    // Clear cache for new calculations
    formulaCache.current = {};

    // Update the current cell
    updates[cellId] = {
      isEditing: false,
      formula: isFormula ? cell.value : undefined,
      computedValue: isFormula ? evaluateFormula(cell.value, cellId) : cell.value
    };

    // Batch update dependent cells
    Object.entries(currentSheet.cells).forEach(([id, otherCell]) => {
      if (otherCell.formula?.includes(cellId)) {
        updates[id] = {
          computedValue: evaluateFormula(otherCell.formula, id)
        };
      }
    });

    // Perform batch update
    batchUpdateCells(updates);
  }, [getCurrentSheet, evaluateFormula]);

  // Update handleCellChange to use useCallback
  const handleCellChange = useCallback((cellId: string, value: string) => {
    const isFormula = value.startsWith('=');
    const updates: Record<string, Partial<CellData>> = {};
    
    // Clear formula cache
    formulaCache.current = {};

    // Update the current cell
    updates[cellId] = {
      value,
      isEditing: true,
      formula: isFormula ? value : undefined,
      computedValue: isFormula ? evaluateFormula(value, cellId) : value
    };

    // Update dependent cells
    Object.entries(getCurrentSheet().cells).forEach(([id, cell]) => {
      if (cell.formula?.includes(cellId)) {
        updates[id] = {
          ...cell,
          computedValue: evaluateFormula(cell.formula, id)
        };
      }
    });

    // Batch update all affected cells
    batchUpdateCells(updates);
  }, [getCurrentSheet, evaluateFormula, batchUpdateCells]);

  // Improved function to get referenced cells
  const getReferencedCells = (formula: string): string[] => {
    if (!formula?.startsWith('=')) return []
    
    // Match any cell reference pattern (e.g., A1, B2, AA1)
    const cellPattern = /[A-Z]+[0-9]+/g
    const matches = formula.match(cellPattern)
    return matches || []
  }

  // Enhanced highlight function for real-time updates
  const getCellHighlight = (cellId: string) => {
    if (!selectedCell) return ''

    // Get the currently edited cell's value
    const editingCell = getCurrentSheet().cells[selectedCell.cellId]
    const editingValue = editingCell?.value || editingCell?.formula || ''

    // Check if we're currently editing a formula
    if (editingValue.startsWith('=')) {
      // Get all cell references from the formula
      const referencedCells = getReferencedCells(editingValue)
      if (referencedCells.includes(cellId)) {
        return 'bg-blue-100'
      }
    }

    return ''
  }

  // Update the MemoizedCellContent component with better padding
  const MemoizedCellContent = React.memo(function MemoizedCellContent({ 
    cellId, 
    cell 
  }: { 
    cellId: string, 
    cell: CellData | undefined 
  }) {
    const highlightClass = getCellHighlight(cellId);
    
    if (cell?.isEditing) {
      return (
        <input
          ref={editInputRef}
          type="text"
          value={cell.formula || cell.value}
          onChange={(e) => handleCellChange(cellId, e.target.value)}
          onBlur={() => handleCellBlur(cellId)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              finishEditing(cellId);
            } else if (e.key === 'Escape') {
              e.preventDefault();
              // Revert changes and exit editing mode
              setExcelState(prev => ({
                ...prev,
                sheets: {
                  ...prev.sheets,
                  [prev.activeSheetId]: {
                    ...prev.sheets[prev.activeSheetId],
                    cells: {
                      ...prev.sheets[prev.activeSheetId].cells,
                      [cellId]: {
                        ...prev.sheets[prev.activeSheetId].cells[cellId],
                        isEditing: false
                      }
                    }
                  }
                }
              }));
            }
          }}
          className={`absolute inset-0 w-full h-full px-2 outline-none bg-white text-black ${highlightClass}`}
          style={{
            padding: `${CELL_DIMENSIONS.padding.y}px ${CELL_DIMENSIONS.padding.x}px`
          }}
          autoFocus
        />
      );
    }

    // Show computed value for formula cells, otherwise show regular value
    const displayValue = cell?.formula ? (cell.computedValue || '#ERROR!') : cell?.value;
    
    return (
      <div 
        className={`w-full h-full truncate text-black ${highlightClass}`}
        style={{
          padding: `${CELL_DIMENSIONS.padding.y}px ${CELL_DIMENSIONS.padding.x}px`
        }}
      >
        {displayValue || ''}
      </div>
    );
  });

  // Update cell rendering to use memoized component
  const renderCellContent = (cellId: string, cell: CellData | undefined) => {
    return (
      <div
        onDoubleClick={() => {
          setExcelState(prev => ({
            ...prev,
            sheets: {
              ...prev.sheets,
              [prev.activeSheetId]: {
                ...prev.sheets[prev.activeSheetId],
                cells: {
                  ...prev.sheets[prev.activeSheetId].cells,
                  [cellId]: {
                    ...cell,
                    isEditing: true,
                    value: cell?.formula || cell?.value || ''
                  }
                }
              }
            }
          }));
        }}
      >
        <MemoizedCellContent cellId={cellId} cell={cell} />
      </div>
    );
  };

  // Update the FormulaBar component with consistent padding
  const FormulaBar = () => {
    const currentCell = selectedCell ? getCurrentSheet().cells[selectedCell.cellId] : null
    const formulaValue = currentCell?.formula || currentCell?.value || ''

    return (
      <div className="flex items-center h-8 border-b border-gray-300 bg-white">
        <div className="w-10 text-gray-600 font-semibold px-2">{selectedCell?.cellId || ''}</div>
        <input
          type="text"
          value={formulaValue}
          onChange={(e) => {
            if (selectedCell) {
              handleCellChange(selectedCell.cellId, e.target.value)
            }
          }}
          className="flex-1 outline-none border border-gray-300 text-black"
          style={{
            padding: `${CELL_DIMENSIONS.padding.y}px ${CELL_DIMENSIONS.padding.x}px`
          }}
          placeholder="Enter formula or value"
        />
      </div>
    )
  }

  // Update the global keyboard event listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (!selectedCell) return;
      
      const [col, row] = [selectedCell.cellId.charCodeAt(0) - 65, parseInt(selectedCell.cellId.slice(1)) - 1];
      const currentSheet = getCurrentSheet();
      const isEditing = currentSheet.cells[selectedCell.cellId]?.isEditing;
      
      // Handle special keys when editing
      if (isEditing) {
        switch (e.key) {
          case 'Enter':
            e.preventDefault();
            finishEditing(selectedCell.cellId);
            if (row < ROWS - 1) {
              handleCellSelect(getCellId(row + 1, col), false);
            }
            return;
            
          case 'Tab':
            e.preventDefault();
            finishEditing(selectedCell.cellId);
            if (e.shiftKey && col > 0) {
              handleCellSelect(getCellId(row, col - 1), true);
            } else if (!e.shiftKey && col < COLS - 1) {
              handleCellSelect(getCellId(row, col + 1), true);
            }
            return;
            
          case 'Escape':
            e.preventDefault();
            // Revert changes and exit editing mode
            setExcelState(prev => ({
              ...prev,
              sheets: {
                ...prev.sheets,
                [prev.activeSheetId]: {
                  ...prev.sheets[prev.activeSheetId],
                  cells: {
                    ...prev.sheets[prev.activeSheetId].cells,
                    [selectedCell.cellId]: {
                      ...prev.sheets[prev.activeSheetId].cells[selectedCell.cellId],
                      isEditing: false
                    }
                  }
                }
              }
            }));
            return;

          // Let other keys pass through when editing
          default:
            return;
        }
      }

      // Handle navigation and special keys when not editing
      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          handleCellSelect(selectedCell.cellId, true);
          break;

        case 'ArrowUp':
          e.preventDefault();
          if (row > 0) {
            handleCellSelect(getCellId(row - 1, col), false);
          }
          break;

        case 'ArrowDown':
          e.preventDefault();
          if (row < ROWS - 1) {
            handleCellSelect(getCellId(row + 1, col), false);
          }
          break;

        case 'ArrowLeft':
          e.preventDefault();
          if (col > 0) {
            handleCellSelect(getCellId(row, col - 1), false);
          }
          break;

        case 'ArrowRight':
          e.preventDefault();
          if (col < COLS - 1) {
            handleCellSelect(getCellId(row, col + 1), false);
          }
          break;

        case 'F2':
          e.preventDefault();
          handleCellSelect(selectedCell.cellId, true);
          break;

        default:
          // Start editing with the typed character
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            handleCellSelect(selectedCell.cellId, true);
            handleCellChange(selectedCell.cellId, e.key);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [selectedCell, handleCellSelect, getCurrentSheet, finishEditing, handleCellChange]);

  // Remove the cell-level handleKeyDown as it's now handled by the global handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent event propagation to avoid double-handling
    e.stopPropagation();
  };

  // Update cell focus useEffect
  useEffect(() => {
    const sheet = getCurrentSheet();
    if (selectedCell && sheet.cells[selectedCell.cellId]?.isEditing) {
      editInputRef.current?.focus();
    }
  }, [selectedCell, getCurrentSheet]);

  // Update the initializeFormulas section in useEffect
  useEffect(() => {
    const initializeFormulas = () => {
      if (formulasInitialized || !getCurrentSheet()) return;
      
      const currentSheet = getCurrentSheet();
      const updates: Record<string, Partial<CellData>> = {};

      // Clear formula cache
      formulaCache.current = {};

      Object.entries(currentSheet.cells).forEach(([cellId, cell]) => {
        if (cell.formula) {
          const computedValue = evaluateFormula(cell.formula, cellId);
          if (computedValue !== cell.computedValue) {
            updates[cellId] = {
              ...cell,
              computedValue
            };
          }
        }
      });

      if (Object.keys(updates).length > 0) {
        batchUpdateCells(updates);
      }

      setFormulasInitialized(true);
    };

    initializeFormulas();
  }, [getCurrentSheet, evaluateFormula, formulasInitialized]);

  // Add another useEffect to handle sheet changes
  useEffect(() => {
    // Reset initialization flag when active sheet changes
    setFormulasInitialized(false);
  }, [excelState.activeSheetId]);

  // Add sheet tabs component
  const SheetTabs = () => {
    return (
      <div className="flex items-center h-8 bg-gray-100 border-t border-gray-300">
        {Object.values(excelState.sheets).map(sheet => (
          <div
            key={sheet.id}
            className="flex items-center"
          >
            <div
              onClick={() => switchSheet(sheet.id)}
              className={`
                px-4 py-1 border-r border-gray-300 cursor-pointer text-black
                ${sheet.id === excelState.activeSheetId ? 'bg-white' : 'hover:bg-gray-200'}
              `}
            >
              {sheet.name}
            </div>
            {Object.keys(excelState.sheets).length > 1 && (
              <button
                onClick={() => deleteSheet(sheet.id)}
                className="px-2 text-gray-500 hover:text-red-500"
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addNewSheet}
          className="px-3 py-1 text-gray-600 hover:bg-gray-200"
        >
          +
        </button>
      </div>
    )
  }

  // Add at the top level of the component
  useEffect(() => {
    return () => {
      // Clear formula cache on unmount
      formulaCache.current = {};
    };
  }, []);

  useEffect(() => {
    const autoSave = () => {
      localStorage.setItem('excelState', JSON.stringify(excelState));
    };

    const saveInterval = setInterval(autoSave, 30000); // Auto-save every 30 seconds
    return () => clearInterval(saveInterval);
  }, [excelState]);

  // Add the renameSheet function inside the component
  const renameSheet = useCallback((sheetId: string, newName: string) => {
    setExcelState(prev => ({
      ...prev,
      sheets: {
        ...prev.sheets,
        [sheetId]: {
          ...prev.sheets[sheetId],
          name: newName
        }
      }
    }))
  }, []);

  const handleMinimize = () => {
    setIsMinimized(true)
    if (onMinimize) {
      onMinimize()
    }
  }

  return (
    <ExcelErrorBoundary>
      <WindowFrame
        title="Excel"
        icon={<FaTable />}
        isOpen={isOpen}
        onClose={onClose}
        onMinimize={handleMinimize}
        defaultSize={{ width: '800px', height: '600px' }}
        defaultPosition={{ x: 80, y: 80 }}
        isMaximized={isMaximized}
        isMinimized={isMinimized}
      >
        <div className="flex flex-col h-full bg-white">
          <FormulaBar />
          <div className="flex-1 overflow-auto">
            <div className="inline-block min-w-full">
              {/* Column Headers */}
              <div className="flex sticky top-0 z-10 bg-[#f8f9fa]">
                <div 
                  className="border-r border-b border-gray-300 bg-[#f8f9fa]"
                  style={{ 
                    width: CELL_DIMENSIONS.rowHeaderWidth,
                    height: CELL_DIMENSIONS.headerHeight
                  }} 
                />
                {Array.from({ length: COLS }).map((_, col) => (
                  <div
                    key={col}
                    className="border-r border-b border-gray-300 bg-[#f8f9fa]
                             flex items-center justify-center text-sm font-semibold text-gray-600"
                    style={{ 
                      width: CELL_DIMENSIONS.width,
                      height: CELL_DIMENSIONS.headerHeight
                    }}
                  >
                    {getColHeader(col)}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {Array.from({ length: ROWS }).map((_, row) => (
                <div key={row} className="flex">
                  {/* Row Header */}
                  <div 
                    className="sticky left-0 bg-[#f8f9fa] border-r border-b border-gray-300 
                             flex items-center justify-center text-sm font-semibold text-gray-600"
                    style={{ 
                      width: CELL_DIMENSIONS.rowHeaderWidth,
                      height: CELL_DIMENSIONS.height
                    }}
                  >
                    {row + 1}
                  </div>

                  {/* Cells */}
                  {Array.from({ length: COLS }).map((_, col) => {
                    const cellId = getCellId(row, col)
                    const cell = getCurrentSheet().cells[cellId]
                    const isSelected = selectedCell && selectedCell.cellId === cellId

                    return (
                      <div
                        key={col}
                        onClick={() => handleCellClick(cellId)}
                        className={`border-r border-b border-gray-300 
                                  relative bg-white ${
                                    isSelected 
                                      ? 'outline outline-1 outline-blue-500 z-10' 
                                      : 'hover:bg-[#f3f3f3]'
                                  } ${getCellHighlight(cellId)}`}
                        style={{ 
                          width: CELL_DIMENSIONS.width,
                          height: CELL_DIMENSIONS.height
                        }}
                      >
                        {renderCellContent(cellId, cell)}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
          <SheetTabs />
        </div>
      </WindowFrame>
    </ExcelErrorBoundary>
  )
}   