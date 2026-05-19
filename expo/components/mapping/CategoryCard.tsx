import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import {
  Plus,
  Edit3,
  Trash2,
  ChevronDown,
  Wallet,
  PiggyBank,
  TrendingUp,
  Home,
  Briefcase,
  GraduationCap,
  HeartHandshake,
  Building2,
  CreditCard,
  Landmark,
  Car,
  CircleDollarSign,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { MappingCategory, MappingItem } from '@/utils/mappingStorage';

interface CategoryCardProps {
  category: MappingCategory;
  onAddItem: (categoryId: string) => void;
  onEditItem: (categoryId: string, item: MappingItem) => void;
  onDeleteItem: (categoryId: string, itemId: string) => void;
  shareOfTotal?: number; // 0..1 — share of this category within its asset/liability bucket
}

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CATEGORY_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  'cash-savings': Wallet,
  tfsa: PiggyBank,
  rrsp: TrendingUp,
  fhsa: Home,
  resp: GraduationCap,
  rdsp: HeartHandshake,
  'non-registered': CircleDollarSign,
  'real-estate': Building2,
  'business-equity': Briefcase,
  mortgage: Landmark,
  'credit-debt': CreditCard,
  'student-loans': GraduationCap,
  'car-loans': Car,
  'other-loans': CircleDollarSign,
};

export default function CategoryCard({
  category,
  onAddItem,
  onEditItem,
  onDeleteItem,
  shareOfTotal = 0,
}: CategoryCardProps) {
  const total = category.items.reduce((sum, item) => sum + item.amount, 0);
  const isAsset = category.type === 'asset';
  const [expanded, setExpanded] = useState<boolean>(category.items.length > 0);
  const rotate = useRef(new Animated.Value(expanded ? 1 : 0)).current;

  const Icon = CATEGORY_ICONS[category.id] ?? (isAsset ? Wallet : CreditCard);
  const tint = isAsset ? Colors.success : Colors.error;
  const tintBg = isAsset ? Colors.successLight : Colors.errorLight;

  const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((v) => !v);
    Animated.spring(rotate, {
      toValue: expanded ? 0 : 1,
      friction: 7,
      tension: 80,
      useNativeDriver: true,
    }).start();
  };

  const chevronRotate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const share = Math.max(0, Math.min(1, shareOfTotal));
  const showBar = total > 0;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={toggle}
        style={styles.header}
        testID={`category-header-${category.id}`}
      >
        <View style={[styles.iconWrap, { backgroundColor: tintBg }]}>
          <Icon size={20} color={tint} />
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.categoryName}>{category.name}</Text>
          <Text style={styles.itemCount}>
            {category.items.length === 0
              ? 'No items'
              : `${category.items.length} item${category.items.length > 1 ? 's' : ''}`}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={[styles.total, { color: tint }]} numberOfLines={1}>
            {formatCurrency(total)}
          </Text>
          <Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
            <ChevronDown size={18} color={Colors.textMuted} />
          </Animated.View>
        </View>
      </TouchableOpacity>

      {showBar && (
        <View style={styles.barTrack}>
          <View
            style={[
              styles.barFill,
              { width: `${Math.max(4, share * 100)}%`, backgroundColor: tint },
            ]}
          />
        </View>
      )}

      {expanded && (
        <View style={styles.body}>
          {category.items.length > 0 ? (
            <View style={styles.itemsList}>
              {category.items.map((item) => (
                <View key={item.id} style={styles.itemRow}>
                  <View style={styles.itemContent}>
                    <Text style={styles.itemLabel}>{item.label}</Text>
                    {!!item.accountType && (
                      <Text style={styles.itemAccountType}>{item.accountType}</Text>
                    )}
                    {!!item.notes && (
                      <Text style={styles.itemNotes} numberOfLines={2}>
                        {item.notes}
                      </Text>
                    )}
                  </View>
                  <View style={styles.itemRight}>
                    <Text style={styles.itemAmount}>
                      {formatCurrency(item.amount)}
                    </Text>
                    <View style={styles.itemActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => onEditItem(category.id, item)}
                        testID={`edit-${item.id}`}
                      >
                        <Edit3 size={14} color={Colors.textSecondary} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.actionButtonDanger]}
                        onPress={() => onDeleteItem(category.id, item.id)}
                        testID={`delete-${item.id}`}
                      >
                        <Trash2 size={14} color={Colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Nothing here yet.</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.addInlineButton, { borderColor: tint }]}
            onPress={() => onAddItem(category.id)}
            testID={`add-${category.id}`}
          >
            <Plus size={16} color={tint} />
            <Text style={[styles.addInlineText, { color: tint }]}>
              Add {category.name}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    minWidth: 0,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.primary,
    letterSpacing: -0.2,
  },
  itemCount: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  total: {
    fontSize: 17,
    fontWeight: '800' as const,
    letterSpacing: -0.3,
  },
  barTrack: {
    height: 4,
    backgroundColor: Colors.borderLight,
    marginHorizontal: 16,
    marginTop: -4,
    marginBottom: 8,
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
  body: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  itemsList: {
    gap: 8,
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  itemContent: {
    flex: 1,
    marginRight: 12,
  },
  itemLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.primary,
    marginBottom: 2,
  },
  itemAccountType: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  itemNotes: {
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: 4,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  itemAmount: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.primary,
    marginBottom: 6,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 6,
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonDanger: {
    backgroundColor: Colors.errorLight,
  },
  emptyState: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  addInlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed' as const,
    backgroundColor: 'transparent',
  },
  addInlineText: {
    fontSize: 14,
    fontWeight: '700' as const,
  },
});
