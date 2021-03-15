import React, { FC, useRef } from 'react'
import prettier from 'prettier'
import parser from 'prettier/parser-babel'
import MonacoEditor, { EditorDidMount } from '@monaco-editor/react'
import codeShift from 'jscodeshift'
import Highlighter from 'monaco-jsx-highlighter'
import './editor.css'
import './syntax.css'

interface CodeEditorProps {
  initialValue: string
  onChange: (value: string) => void
}

const CodeEditor: FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const editorRef = useRef<any>(null)

  const handleEditorDidMount: EditorDidMount = (getValue, editor) => {
    editorRef.current = editor

    editor.onDidChangeModelContent(() => {
      onChange(getValue())
    })
    editor.getModel()?.updateOptions({ tabSize: 2 })

    const highlighter = new Highlighter(
      //@ts-ignore
      window.monaco,
      codeShift,
      editor
    )

    highlighter.highLightOnDidChangeModelContent(
      () => {},
      () => {},
      undefined,
      () => {}
    )
  }

  const handleFormat = () => {
    const unformatted = editorRef.current.getModel().getValue()

    const formatted = prettier
      .format(unformatted, {
        parser: 'babel',
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true,
      })
      .replace(/\n$/, '')

    editorRef.current.setValue(formatted)
  }

  return (
    <div className='editor-wrapper'>
      <button
        className='button button-format is-primary is-small'
        onClick={handleFormat}
      >
        Format
      </button>
      <MonacoEditor
        value={initialValue}
        editorDidMount={handleEditorDidMount}
        theme='dark'
        language='javascript'
        height='100%'
        options={{
          wordWrap: 'on',
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  )
}

export default CodeEditor
