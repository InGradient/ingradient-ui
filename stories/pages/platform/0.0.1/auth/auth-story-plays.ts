import { expect, userEvent, within } from 'storybook/test'
import type { LoginStoryArgs, SignupStoryArgs } from './auth-story-runtime'

type Canvas = ReturnType<typeof within>
type Step = (label: string, run: () => Promise<void> | void) => Promise<void> | void

async function clickCheckbox(input: HTMLElement) {
  const label = input.closest('label')
  if (!label) throw new Error('Expected Auth checkbox to be wrapped by a label')
  await userEvent.click(label)
}

function settleInitialEffects() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  })
}

export async function playLoginWorkflow({
  args,
  canvas,
  step,
}: { args: LoginStoryArgs; canvas: Canvas; step: Step }) {
  await settleInitialEffects()

  await step('Correct the rejected credentials', async () => {
    await expect(canvas.getByText('Invalid email or password.')).toBeVisible()
    const email = canvas.getByLabelText('Email')
    const password = canvas.getByLabelText('Password')
    await userEvent.clear(email)
    await userEvent.type(email, 'operator@ingradient.ai')
    await userEvent.clear(password)
    await userEvent.type(password, 'secure-passphrase')
    await expect(args.onEmailChange).toHaveBeenLastCalledWith('operator@ingradient.ai')
    await expect(args.onPasswordChange).toHaveBeenLastCalledWith('secure-passphrase')
    await expect(canvas.queryByText('Invalid email or password.')).not.toBeInTheDocument()
  })

  await step('Set sign-in preferences and submit', async () => {
    await clickCheckbox(canvas.getByRole('checkbox', { name: 'Keep me signed in' }))
    await clickCheckbox(canvas.getByRole('checkbox', { name: 'Remember password' }))
    await expect(args.onKeepSignedInChange).toHaveBeenLastCalledWith(true)
    await expect(args.onRememberPasswordChange).toHaveBeenLastCalledWith(true)
    await userEvent.click(canvas.getByRole('button', { name: 'Sign in' }))
    await expect(args.onSubmit).toHaveBeenLastCalledWith({
      email: 'operator@ingradient.ai',
      password: 'secure-passphrase',
      keepSignedIn: true,
      rememberPassword: true,
    })
  })

  await step('Open account registration', async () => {
    await userEvent.click(canvas.getByRole('link', { name: 'Sign up' }))
    await expect(args.onNavigateSignup).toHaveBeenCalledOnce()
  })
}

export async function playSignupWorkflow({
  args,
  canvas,
  step,
}: { args: SignupStoryArgs; canvas: Canvas; step: Step }) {
  await settleInitialEffects()

  await step('Complete the account form', async () => {
    await userEvent.type(canvas.getByLabelText('Email'), 'new.operator@ingradient.ai')
    await userEvent.type(canvas.getByLabelText('Name'), 'New Operator')
    await userEvent.type(canvas.getByLabelText('Organization'), 'Ingradient')
    await userEvent.type(canvas.getByLabelText('Password'), 'secure-passphrase')
    await expect(args.onEmailChange).toHaveBeenLastCalledWith('new.operator@ingradient.ai')
    await expect(args.onNameChange).toHaveBeenLastCalledWith('New Operator')
    await expect(args.onOrganizationChange).toHaveBeenLastCalledWith('Ingradient')
    await expect(args.onPasswordChange).toHaveBeenLastCalledWith('secure-passphrase')
  })

  await step('Submit the new account', async () => {
    await userEvent.click(canvas.getByRole('button', { name: 'Sign up' }))
    await expect(args.onSubmit).toHaveBeenLastCalledWith({
      email: 'new.operator@ingradient.ai',
      name: 'New Operator',
      organization: 'Ingradient',
      password: 'secure-passphrase',
    })
  })

  await step('Return to sign in', async () => {
    await userEvent.click(canvas.getByRole('link', { name: 'Sign in' }))
    await expect(args.onNavigateLogin).toHaveBeenCalledOnce()
  })
}
