import { HStack, InputLeftAddon, View } from 'native-base'
import React, {
  RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
} from 'react'
import {
  Keyboard,
  NativeSyntheticEvent,
  Platform,
  TextInput,
  TextInputKeyPressEventData,
} from 'react-native'
import OtpInput from './OtpInput'

type Props = {
  length: number
  defaultValue?: string
  handleChange?: (otpCode: string) => void
}

export const fillOtpCode = (numberOfInputs: number, value?: string) => {
  const otpCode: { [key: string]: string } = {}
  for (let i = 0; i < numberOfInputs; i++) {
    otpCode[`${i}`] = value?.[i] || ''
  }
  return otpCode
}

const ACTION_TYPES: ActionTypes = {
  setHandleChange: 'setHandleChange',
  setOtpTextForIndex: 'setOtpTextForIndex',
  setOtpCode: 'setOtpCode',
  clearOtp: 'clearOtp',
  setHasKeySupport: 'setHasKeySupport',
}

type SetOtpTextForIndex = {
  type: 'setOtpTextForIndex'
  payload: { index: number; text: string }
}
type SetOtpCode = {
  type: 'setOtpCode'
  payload: { numberOfInputs: number; code: string }
}
type ClearOtp = { type: 'clearOtp'; payload: number }
type SetHandleChange = { type: 'setHandleChange'; payload: any }
type SetHasKeySupport = { type: 'setHasKeySupport'; payload: boolean }

export type ReducerState = {
  otpCode: { [key: string]: string }
  handleChange: (otpCode: string) => void
  hasKeySupport: boolean
}

export type ActionTypes = {
  setHandleChange: 'setHandleChange'
  setOtpTextForIndex: 'setOtpTextForIndex'
  setOtpCode: 'setOtpCode'
  clearOtp: 'clearOtp'
  setHasKeySupport: 'setHasKeySupport'
}

export type Actions =
  | SetOtpTextForIndex
  | SetOtpCode
  | ClearOtp
  | SetHandleChange
  | SetHasKeySupport

export type OtpInputsRef = {
  reset: () => void
  focus: () => void
}

export type KeyEventType = {
  action: number
  pressedKey: string
  keyCode: number
}

export type SupportedKeyboardType =
  | 'default'
  | 'email-address'
  | 'phone-pad'
  | 'visible-password'
  | 'ascii-capable'
  | 'numbers-and-punctuation'
  | 'url'
  | 'name-phone-pad'
  | 'twitter'
  | 'web-search'
  | undefined

const reducer = (state: ReducerState, { type, payload }: Actions) => {
  switch (type) {
    case ACTION_TYPES.setOtpTextForIndex: {
      const otpCode = {
        ...state.otpCode,
        [`${payload.index}`]: payload.text,
      }
      state.handleChange(Object.values(otpCode).join(''))

      return {
        ...state,
        otpCode,
      }
    }

    case ACTION_TYPES.setOtpCode: {
      const otpCode = fillOtpCode(payload.numberOfInputs, payload.code)

      state.handleChange(Object.values(otpCode).join(''))

      return {
        ...state,
        otpCode,
      }
    }

    case ACTION_TYPES.clearOtp: {
      const otpCode = fillOtpCode(payload)
      state.handleChange(Object.values(otpCode).join(''))

      return { ...state, otpCode }
    }

    case ACTION_TYPES.setHandleChange: {
      return { ...state, handleChange: payload }
    }

    case ACTION_TYPES.setHasKeySupport: {
      return { ...state, hasKeySupport: payload }
    }

    default:
      return state
  }
}

export default function Otp({ length, defaultValue, handleChange }: Props) {
  const inputs = useRef<Array<RefObject<TextInput>>>([])

  const [{ otpCode, hasKeySupport }, dispatch] = useReducer(
    reducer,
    {},
    () => ({
      otpCode: fillOtpCode(length, defaultValue),
      handleChange,
      hasKeySupport: Platform.OS === 'ios',
    })
  )

  const handleKeyPress = (
    { nativeEvent: { key } }: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    const text = key === 'Backspace' || key.length > 1 ? '' : key
    handleInputTextChange(text, index)

    if (Platform.OS === 'android' && !hasKeySupport && !isNaN(parseInt(key)))
      dispatch({ type: 'setHasKeySupport', payload: true })
  }

  const handleTextChange = (text: string, index: number) => {
    if (
      (Platform.OS === 'android' && !hasKeySupport) ||
      // Pasted from input accessory
      (Platform.OS === 'ios' && text.length > 1)
    ) {
      handleInputTextChange(text, index)
    }
  }

  const fillInputs = useCallback(
    (code: string) => {
      dispatch({
        type: 'setOtpCode',
        payload: {
          numberOfInputs: length,
          code,
        },
      })
    },
    [length]
  )

  const focusInput = useCallback(
    (index: number): void => {
      if (index >= 0 && index < length) {
        const input = inputs.current[index]
        input?.current?.focus()
      }
    },
    [length]
  )

  const handleInputTextChange = (text: string, index: number): void => {
    if (!text.length) {
      handleClearInput(index)
    }

    if (text.length > 1) {
      handleClearInput(index)
      Keyboard.dismiss()
      return fillInputs(text)
    }

    if (text) {
      dispatch({
        type: 'setOtpTextForIndex',
        payload: {
          text,
          index,
        },
      })
      focusInput(index + 1)
    }

    if (index === length - 1 && text) {
      Keyboard.dismiss()
    }
  }

  useEffect(() => {
    if (defaultValue) {
      dispatch({
        type: 'setOtpCode',
        payload: { numberOfInputs: length, code: defaultValue },
      })
    }
  }, [defaultValue, length])

  const handleClearInput = useCallback(
    (inputIndex: number) => {
      const input = inputs.current[inputIndex]
      input?.current?.clear()
      dispatch({
        type: 'setOtpTextForIndex',
        payload: {
          index: inputIndex,
          text: '',
        },
      })
      focusInput(inputIndex - 1)
    },
    [focusInput]
  )

  useEffect(() => {
    dispatch({ type: 'setHandleChange', payload: handleChange })
  }, [handleChange])

  const renderInputs = () => {
    const iterationArray = Array<number>(length).fill(0)
    return iterationArray.map((_, index) => {
      let inputIndex = index
      const inputValue = otpCode[`${inputIndex}`]

      if (!inputs.current[inputIndex]) {
        inputs.current[inputIndex] = React.createRef<TextInput>()
      }

      return (
        <TextInput
          autoFocus={index === 0 && true}
          key={inputIndex}
          keyboardType="number-pad"
          maxLength={1}
          textAlign="center"
          value={inputValue}
          ref={inputs.current[inputIndex]}
          onKeyPress={(
            event: NativeSyntheticEvent<TextInputKeyPressEventData>
          ) => handleKeyPress(event, inputIndex)}
          onChangeText={(text: string) => handleTextChange(text, inputIndex)}
          style={{
            width: 60,
            height: 80,
            fontSize: 24,
            borderWidth: 1,
            borderColor: inputs?.current[inputIndex]?.current?.isFocused()
              ? '#4CBBC0'
              : '#c0c0c0',
            color: '#000',
            borderRadius: 16,
          }}
        />
      )
    })
  }

  return (
    <HStack space="4" alignItems="center" justifyContent="center">
      {renderInputs()}
    </HStack>
  )
}
