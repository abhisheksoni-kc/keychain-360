'use client'

import {
  RocketLaunchIcon,
  ViewfinderCircleIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  MapPinIcon,
  ShareIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  BellIcon,
  UserPlusIcon,
  ArrowLeftIcon,
  CalendarIcon,
  UsersIcon,
  EllipsisHorizontalIcon,
  XMarkIcon,
  PlusIcon,
  InformationCircleIcon,
  FunnelIcon,
  CheckIcon,
  CheckCircleIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline'

const ICON_MAP: Record<string, React.ElementType> = {
  'rocket': RocketLaunchIcon,
  'target': ViewfinderCircleIcon,
  'file-text': DocumentTextIcon,
  'globe': GlobeAltIcon,
  'map-pin': MapPinIcon,
  'git-branch': ShareIcon,
  'sparkles': SparklesIcon,
  'search': MagnifyingGlassIcon,
  'chevron-right': ChevronRightIcon,
  'chevron-down': ChevronDownIcon,
  'bell': BellIcon,
  'user-plus': UserPlusIcon,
  'arrow-left': ArrowLeftIcon,
  'calendar': CalendarIcon,
  'users': UsersIcon,
  'more-horizontal': EllipsisHorizontalIcon,
  'x': XMarkIcon,
  'plus': PlusIcon,
  'info': InformationCircleIcon,
  'filter': FunnelIcon,
  'check': CheckIcon,
  'check-circle': CheckCircleIcon,
  'bars-3': Bars3Icon,
}

export function NavIcon({ name, size = 16 }: { name: string; size?: number }) {
  const Icon = ICON_MAP[name]
  if (!Icon) return null
  return <Icon width={size} height={size} />
}
